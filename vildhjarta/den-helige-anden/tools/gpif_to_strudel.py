#!/usr/bin/env python3
"""Guitar Pro 8 (.gp, GPIF) -> self-contained Strudel note-event arrangement.

No third-party packages required. The generated .js runs in the Strudel REPL.
Keeps note pitches, simultaneity, rhythmic tuplets, ties, time signatures and
bar-boundary tempo changes. Bends / slides / let-ring are not envelope rendered.
"""
from __future__ import annotations
import argparse
from collections import defaultdict, deque
from dataclasses import dataclass
from fractions import Fraction
from hashlib import sha256
import json
from pathlib import Path
import xml.etree.ElementTree as ET
import zipfile

TPQ = 96
ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_'
VALUES = {'Whole':4, 'Half':2, 'Quarter':1, 'Eighth':Fraction(1, 2),
          '16th':Fraction(1,4), '32nd':Fraction(1,8),
          '64th':Fraction(1,16), '128th':Fraction(1,32)}
DYN = ('PPP','PP','P','MP','MF','F','FF','FFF')


def child_text(el, path, default=''):
    val = el.findtext(path)
    return default if val is None else val.strip()


def must_int(frac, context):
    if frac.denominator != 1:
        raise ValueError(f'{context}: required >96 ticks/quarter precision: {frac}')
    return int(frac)


def rhythm_ticks(el):
    note = child_text(el, 'NoteValue')
    if note not in VALUES:
        raise ValueError(f'Unknown rhythm {note}')
    beats = Fraction(VALUES[note])
    dot = el.find('AugmentationDot')
    if dot is not None:
        count = int(dot.get('count','0'))
        beats *= sum((Fraction(1,2**i) for i in range(count+1)), Fraction(0))
    for tag in ('PrimaryTuplet', 'SecondaryTuplet'):
        tup = el.find(tag)
        if tup is not None:
            beats *= Fraction(int(tup.get('den')), int(tup.get('num')))
    return must_int(beats * TPQ, f'rhythm {el.get("id")}')


def vuint(x):
    assert x >= 0
    s = ''
    while x >= 32:
        s += ALPHABET[(x & 31) | 32]
        x >>= 5
    return s + ALPHABET[x]


def midi_flag(note):
    flags = 0
    if note.find('Properties/Property[@name="PalmMuted"]') is not None or note.find('Properties/Property[@name="Muted"]') is not None:
        flags |= 1
    if note.find('Properties/Property[@name="Bended"]') is not None:
        flags |= 2
    if note.find('Properties/Property[@name="Slide"]') is not None:
        flags |= 4
    return flags


@dataclass
class Event:
    start: int
    end: int
    midi: int
    dyn: int
    flags: int
    track: int
    voice: int
    string: int


def read_score(path):
    raw=path.read_bytes()
    if not zipfile.is_zipfile(path):
        raise ValueError('Expected zipped Guitar Pro 7/8 .gp file containing Content/score.gpif')
    with zipfile.ZipFile(path) as archive:
        root=ET.fromstring(archive.read('Content/score.gpif'))
    title=child_text(root,'Score/Title'); artist=child_text(root,'Score/Artist')
    tracks=root.findall('Tracks/Track')
    names=[child_text(t,'Name') for t in tracks]
    master=root.findall('MasterBars/MasterBar')
    beats={int(e.get('id')):e for e in root.findall('Beats/Beat')}
    notes={int(e.get('id')):e for e in root.findall('Notes/Note')}
    bars={int(e.get('id')):e for e in root.findall('Bars/Bar')}
    voices={int(e.get('id')):e for e in root.findall('Voices/Voice')}
    rhythms={int(e.get('id')):rhythm_ticks(e) for e in root.findall('Rhythms/Rhythm')}
    bar_starts=[0]; meters=[]; bar_sections=[]
    for i, b in enumerate(master):
        meter=child_text(b,'Time')
        num, den=map(int,meter.split('/'))
        bar_ticks=must_int(Fraction(num*4*TPQ,den),f'meter {meter}')
        meters.append(meter)
        bar_sections.append(child_text(b,'Section/Text'))
        bar_starts.append(bar_starts[-1] + bar_ticks)
    tempo=[]
    for auto in root.findall('MasterTrack/Automations/Automation'):
        if child_text(auto,'Type')!='Tempo':
            continue
        bi=int(child_text(auto,'Bar'))
        pos=int(child_text(auto,'Position'))
        if pos:
            raise ValueError(f'Unsupported intra-bar tempo automation: bar {bi+1}, position {pos}')
        bpm=float(child_text(auto,'Value').split()[0])
        tempo.append((bar_starts[bi],bpm))
    tempo.sort()
    if not tempo or tempo[0][0] != 0:
        raise ValueError('No initial tempo found')
    evs=[[] for _ in tracks]
    warnings=[]
    for bi, mb in enumerate(master):
        ids=[int(v) for v in child_text(mb,'Bars').split()]
        if len(ids)!=len(tracks):
            raise ValueError(f'Bar {bi+1} has {len(ids)} references, expected {len(tracks)}')
        start=bar_starts[bi]; end=bar_starts[bi+1]
        for ti, bar_id in enumerate(ids):
            b=bars[bar_id]
            vids=[int(x) for x in child_text(b,'Voices').split() if x != '-1']
            for vix, vid in enumerate(vids):
                t=start
                beat_ids=[int(x) for x in child_text(voices[vid],'Beats').split()]
                # Whole-measure rests are notated as a whole rest even in e.g. 2/8.
                if len(beat_ids)==1 and child_text(beats[beat_ids[0]],'Notes')=='':
                    continue
                for beat_id in beat_ids:
                    beat=beats[beat_id]
                    duration=rhythms[int(beat.find('Rhythm').get('ref'))]
                    if t>=end:
                        if child_text(beat,'Notes'):
                            warnings.append(f'note beyond bar {bi+1} in {names[ti]}')
                        t += duration;continue
                    nids=[int(x) for x in child_text(beat,'Notes').split()]
                    dyn=child_text(beat,'Dynamic','F')
                    dyn_index=DYN.index(dyn) if dyn in DYN else 5
                    for nid in nids:
                        note=notes[nid]
                        midi=int(child_text(note,'Properties/Property[@name="Midi"]/Number'))
                        string=int(child_text(note,'Properties/Property[@name="String"]/String','-1'))
                        tie=note.find('Tie')
                        from_tie = tie is not None and tie.get('destination') == 'true'
                        to_tie = tie is not None and tie.get('origin') == 'true'
                        evs[ti].append((Event(t,min(t+duration,end),midi,dyn_index,midi_flag(note),ti,vix,string),from_tie,to_tie))
                    t += duration
                if t != end:
                    warnings.append(f'duration mismatch bar {bi+1} {names[ti]}: {t-start} vs {end-start} ticks')

    out=[]; stats=[]
    for ti, candidates in enumerate(evs):
        result=[];open_ties={};unmatched=0
        for ev,continuation,leads_to_next in candidates:
            key=(ev.voice,ev.string,ev.midi)
            if continuation and key in open_ties:
                prev=open_ties[key]
                prev.end=max(prev.end,ev.end)
                prev.flags |= ev.flags
                if not leads_to_next: del open_ties[key]
            else:
                if continuation:unmatched+=1
                result.append(ev)
                if leads_to_next:open_ties[key]=ev
                elif key in open_ties: del open_ties[key]
        result.sort(key=lambda e:(e.start,e.midi,e.end,e.voice))
        stats.append(dict(track=ti,name=names[ti],count=len(result),unmatched_ties=unmatched,
                          pitch_range=[min((e.midi for e in result),default=None), max((e.midi for e in result),default=None)]))
        out.append(result)
        if unmatched: warnings.append(f'{names[ti]}: {unmatched} unattached tied continuations retained as onsets')
    meta={
      'title':title,'artist':artist,'bars':len(master),'tracks':names,
      'time_signatures':meters,'bar_starts_ticks':bar_starts,
      'sections':[{'bar':i+1,'title':sec} for i,sec in enumerate(bar_sections) if sec],
      'tempo_changes':[{'bar':next(i+1 for i,s in enumerate(bar_starts) if s==tick),'tick':tick,'bpm':bpm} for tick,bpm in tempo],
      'ticks_per_quarter':TPQ,'source_sha256':sha256(raw).hexdigest(),
      'track_stats':stats, 'warnings':warnings,
      'technique_limitations':'Slides and pitch-bend contours not acoustically synthesized; let-ring and amp/effects approximate.',
    }
    return meta,out


def encode_score(events, meta):
    notes=[n for t in events for n in t]
    pmin=min(e.midi for e in notes)
    pmax=max(e.midi for e in notes)
    pitch_bits=max(1,(pmax-pmin).bit_length())
    width=(pitch_bits+6+5)//6
    encoded=[]
    for track in events:
        prev=0;parts=[]
        for e in track:
            if e.start<prev: raise AssertionError('notes not sorted')
            dt=e.start-prev
            prev=e.start
            length=e.end-e.start
            if length<=0:continue
            packed=((e.midi-pmin)<<6)|(e.dyn<<3)|e.flags
            piece=vuint(dt)+vuint(length)+''.join(ALPHABET[(packed >> (6*i))&63] for i in range(width))
            parts.append(piece)
        encoded.append(''.join(parts))
    return {'pitch_base':pmin,'meta_width':width,'data':encoded}


def lz_pack(data):
    """Tiny LZSS: literal alphabet chars or '~' + 12-bit distance + 6-bit length.

    The source data itself uses the A-Za-z0-9_- alphabet, with dots between
    tracks. Neither '~' nor dot occurs inside a track's compact note stream.
    """
    lookup=defaultdict(deque)
    pos=0;out=[]
    while pos<len(data):
        token=data[pos:pos+4];bucket=lookup[token]
        while bucket and pos-bucket[0]>4095:bucket.popleft()
        longest=0;dist=0
        for old in reversed(list(bucket)[-80:]):
            length=4
            while length<67 and pos+length<len(data) and data[old+length]==data[pos+length]:
                length+=1
            if length>longest:longest=length;dist=pos-old
            if longest==67:break
        length=longest if longest>=5 else 1
        if length>1:
            out.append('~'+ALPHABET[(dist>>6)&63]+ALPHABET[dist&63]+ALPHABET[length-4])
        else:
            out.append(data[pos])
        for j in range(pos,pos+length):lookup[data[j:j+4]].append(j)
        pos+=length
    return ''.join(out)


JS_HEADER='''// {ARTIST} — {TITLE}
// Full-score Strudel port, generated from user-supplied Guitar Pro 8 transcription.
// Source: {SOURCE}
// {BARS} measures / {TRACKS} tracks; true meter, tuplet, tie and tempo timing.
// To play: paste this entire file into https://strudel.cc/ and press Play.
// MIDI=false uses approximate WebAudio instruments. MIDI=true sends native
// pitches/velocities on separate channels (channel 10 = drum map); select a
// MIDI output device in Strudel and configure your own instrument plugins.
// Bends, continuous slides, let-ring acoustics and guitar articulations are
// not accurately reproduced by the pitched-note sampler.

setcpm(60);  // One Strudel cycle = one second; tempo is baked into note times.
const MIDI = false;
const START_BAR = 1;          // 1-based, inclusive
const END_BAR = {BARS};       // 1-based, inclusive
const TPQ = {TPQ};
const BAR_TICKS = {BAR_TICKS};
const TEMPOS = {TEMPOS};
const PITCH_BASE = {BASE};
const META_WIDTH = {WIDTH};
const TRACK_NAMES = {TRACK_NAMES};
const SECTIONS = {SECTIONS};
const ALPHA = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
const LOOKUP = Object.fromEntries([...ALPHA].map((x,i)=>[x,i]));
// Compact reversible event format: delta-onset ticks, duration ticks,
// then two (or three) six-bit characters for [pitch, dynamic, articulations].
// Each track records simultaneous pitches independently, preserving chords.
const PACKED_LZ = {PACKED};
function unLZ(src) {{
  const out=[];
  for(let i=0;i<src.length;) {{
    let ch=src[i++];
    if(ch!=='~') {{out.push(ch);continue;}}
    const distance=(LOOKUP[src[i++]]<<6)|LOOKUP[src[i++]];
    const length=LOOKUP[src[i++]]+4;
    if(distance<1||distance>out.length)throw Error('Corrupt compressed score');
    for(let j=0;j<length;j++)out.push(out[out.length-distance]);
  }}
  return out.join('');
}}
const PACKED = unLZ(PACKED_LZ).split('.');

// Decode VUInt (5-bit little-endian chunks, high bit 32 = continuation).
function unpack(part) {{
  let pos=0,prev=0,events=[];
  function read() {{
    let number=0,shift=0,n;
    do {{
      if (pos >= part.length) throw Error('Truncated note data');
      n=LOOKUP[part[pos++]];
      number += (n & 31) * 2**shift;
      shift += 5;
    }} while (n & 32);
    return number;
  }}
  while(pos<part.length) {{
    prev += read();
    const length=read();
    let bits=0;
    for (let j=0;j<META_WIDTH;j++) bits|=LOOKUP[part[pos++]]<<(6*j);
    const pitch=PITCH_BASE+(bits>>6);
    const dyn=(bits>>3)&7;
    const flags=bits&7;
    events.push([prev,prev+length,pitch,dyn,flags]);
  }}
  return events;
}}

const METERS = TEMPOS.map(([tick,bpm],i)=>{{
  return [tick,bpm,0];
}});
for(let i=1;i<METERS.length;i++){{
  const [tick,bpm] = METERS[i];
  const [priorTick,priorBpm,priorSec] = METERS[i-1];
  METERS[i][2] = priorSec + (tick-priorTick)*60/(TPQ*priorBpm);
}}
function tickToSec(tick) {{
  let lo=0,hi=METERS.length;
  while(lo+1<hi){{let m=(lo+hi)>>1;if(METERS[m][0]<=tick)lo=m;else hi=m;}}
  let [anchor,bpm,time] = METERS[lo];
  return time + (tick-anchor)*60/(TPQ*bpm);
}}
const sectionStart=BAR_TICKS[START_BAR-1];
const sectionEnd=BAR_TICKS[END_BAR];
const sectionOffset=tickToSec(sectionStart);
const LOOP_LENGTH=tickToSec(sectionEnd)-sectionOffset;
// Precompute seconds and pitches exactly once; loops are assembled on query.
const SCHEDULES=PACKED.map(part=>unpack(part)
  .filter(([t,e])=>t<sectionEnd&&e>sectionStart)
  .map(([t,e,p,v,f])=>[Math.max(0,tickToSec(t)-sectionOffset),
                          Math.min(LOOP_LENGTH,tickToSec(e)-sectionOffset), p,v,f])
  .filter(([s,e])=>e>s)
  .sort((a,b)=>a[0]-b[0]));

const DRUM_SOUNDS={{36:'bd',38:'sd',40:'sd',41:'tom',42:'hh',43:'tom',44:'hh',
  45:'tom',46:'oh',47:'tom',48:'tom',49:'cr',50:'tom',51:'rd',52:'cr',
  53:'rd',55:'cr',57:'cr',59:'rd'}};
const CHANNELS=[10,1,2,3,4,5,6,7,8,9,11];
const VELOCITY=[.18,.25,.34,.47,.59,.71,.83,.94];

// Pure pattern; Strudel's scheduler queries only the relevant note onsets.
// A Hap has independent whole and part spans: do not re-trigger a tied note.
function scorePart(track,midiMode){{
  const notes=SCHEDULES[track];
  const maxDur=notes.reduce((m,n)=>Math.max(m,n[1]-n[0]),0);
  function lowerBound(x){{
    let low=0,hi=notes.length;
    while(low<hi){{let mid=(low+hi)>>1;if(notes[mid][0]<x)low=mid+1;else hi=mid;}}
    return low;
  }}
  return new Pattern(state=>{{
    const begin=Number(state.span.begin),end=Number(state.span.end),out=[];
    if(!(end>begin) || !(LOOP_LENGTH>0))return out;
    const firstLoop=Math.floor((begin-maxDur)/LOOP_LENGTH);
    const lastLoop=Math.floor(end/LOOP_LENGTH);
    for(let k=firstLoop;k<=lastLoop;k++){{
      const shift=k*LOOP_LENGTH;
      const first=lowerBound(begin-shift-maxDur);
      for(let i=first;i<notes.length;i++){{
        const [s,e,pitch,dyn,flags]=notes[i];
        if(s+shift>=end)break;
        if(e+shift<=begin)continue;
        const a=s+shift,b=e+shift;
        const whole=new TimeSpan(a,b);
        const part=new TimeSpan(Math.max(a,begin),Math.min(b,end));
        const velocity=VELOCITY[dyn]*(flags&1 ? .65 : 1);
        const value=(track===0&&!midiMode)
          ? {{s:DRUM_SOUNDS[pitch]||'hh',velocity}}
          : {{note:pitch,velocity}};
        out.push(new Hap(whole,part,value));
      }}
    }}
    return out;
  }});
}}

// WebAudio approximation: replace samples / gain / effects to taste.
function webPart(i,p){{
  switch(i){{
    case 0: return p.bank('RolandTR909').gain(.58).orbit(0);
    case 1: return p.s('gm_synth_bass_1').clip(1).lpf(2200).gain(.65).pan(.5).orbit(1);
    case 2: return p.s('gm_electric_guitar_muted').clip(1).distort('3:.32').lpf(6000).gain(.34).pan(.17).orbit(2);
    case 3: return p.s('gm_electric_guitar_muted').clip(1).distort('3:.32').lpf(6000).gain(.34).pan(.83).orbit(3);
    case 4: return p.s('gm_electric_guitar_muted').clip(1).distort('3.5:.3').lpf(5300).gain(.28).pan(.12).orbit(4);
    case 5: return p.s('gm_electric_guitar_muted').clip(1).distort('3.5:.3').lpf(5300).gain(.28).pan(.88).orbit(5);
    case 6: return p.s('gm_electric_guitar_clean').clip(1).room(.42).gain(.43).pan(.2).orbit(6);
    case 7: return p.s('gm_electric_guitar_clean').clip(1).room(.42).gain(.43).pan(.8).orbit(7);
    case 8: return p.s('gm_electric_guitar_clean').clip(1).delay(.36).delaytime(.3).room(.48).gain(.28).pan(.6).orbit(8);
    case 9: return p.s('gm_electric_guitar_clean').clip(1).delay(.45).delaytime(.4).room(.65).gain(.30).pan(.28).orbit(9);
    default:return p.s('gm_electric_guitar_clean').clip(1).room(.7).gain(.30).pan(.72).orbit(10);
  }}
}}

// Inspired by the MIDI-routing structure of the Meshuggah Strudel cover
// (Alvaro Caceres): https://github.com/alvaro-caceres-munoz/live-coding-metal
const parts=TRACK_NAMES.map((_,i)=>scorePart(i,MIDI));
$score: MIDI
 ? stack(...parts.map((p,i)=>p.midichan(CHANNELS[i]))).midi()
 : stack(...parts.map((p,i)=>webPart(i,p)));
'''


def create_strudel(meta, encoded, source_url):
    sections=json.dumps(meta['sections'],ensure_ascii=False,separators=(',',':'))
    return JS_HEADER.format(
      ARTIST=meta['artist'],TITLE=meta['title'],SOURCE=source_url,
      BARS=meta['bars'],TRACKS=len(meta['tracks']),TPQ=TPQ,
      BAR_TICKS=json.dumps(meta['bar_starts_ticks'],separators=(',',':')),
      TEMPOS=json.dumps([[t['tick'],t['bpm']] for t in meta['tempo_changes']],separators=(',',':')),
      BASE=encoded['pitch_base'],WIDTH=encoded['meta_width'],
      TRACK_NAMES=json.dumps(meta['tracks'],ensure_ascii=False,separators=(',',':')),
      SECTIONS=sections,
      PACKED=json.dumps(lz_pack('.'.join(encoded['data'])))
    )


def main():
    p=argparse.ArgumentParser(description=__doc__)
    p.add_argument('source',type=Path)
    p.add_argument('-o','--output',type=Path)
    p.add_argument('--source-url',default='User-supplied GPIF transcription')
    args=p.parse_args()
    meta,events=read_score(args.source)
    enc=encode_score(events,meta)
    out=args.output or args.source.with_suffix('.js')
    out.parent.mkdir(parents=True,exist_ok=True)
    out.write_text(create_strudel(meta,enc,args.source_url),encoding='utf-8')
    (out.parent/'score_metadata.json').write_text(json.dumps(meta,indent=2,ensure_ascii=False)+'\n',encoding='utf-8')
    print(f'Created {out} ({out.stat().st_size} bytes)')
    print(f"{meta['bars']} bars, {len(events)} tracks, {sum(len(e) for e in events)} note onsets after ties")
    print('warnings:',meta['warnings'])


if __name__=='__main__':
    main()