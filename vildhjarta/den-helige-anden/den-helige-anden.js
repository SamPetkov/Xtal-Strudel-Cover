// Vildhjarta — Den Helige Anden
// Full-score Strudel port, generated from user-supplied Guitar Pro 8 transcription.
// Source: https://www.songsterr.com/a/wsa/vildhjarta-den-helige-anden-tab-s463766
// 137 measures / 11 tracks; true meter, tuplet, tie and tempo timing.
// To play: paste this entire file into https://strudel.cc/ and press Play.
// MIDI=false uses approximate WebAudio instruments. MIDI=true sends native
// pitches/velocities on separate channels (channel 10 = drum map); select a
// MIDI output device in Strudel and configure your own instrument plugins.
// Bends, continuous slides, let-ring acoustics and guitar articulations are
// not accurately reproduced by the pitched-note sampler.

setcpm(60);  // One Strudel cycle = one second; tempo is baked into note times.
const MIDI = false;
const START_BAR = 1;          // 1-based, inclusive
const END_BAR = 137;       // 1-based, inclusive
const TPQ = 96;
const BAR_TICKS = [0,384,768,1152,1536,1920,2304,2688,3072,3456,3840,4224,4608,4992,5376,5760,5952,6048,6144,6432,6816,7104,7584,7632,8016,8400,8784,9168,9552,9936,10320,10704,11088,11472,11856,12240,12624,13008,13392,13776,14160,14544,14928,15312,15696,16080,16416,16800,17184,17568,17952,18336,18720,19104,19488,19536,19920,20304,20688,21072,21456,21840,22224,22608,22992,23376,23760,24144,24528,24912,25296,25680,26064,26448,26832,27216,27600,27984,28368,28752,29136,29520,29904,30288,30672,31056,31440,31824,32208,32592,32976,33360,33744,34128,34512,34896,35280,35664,36048,36432,36816,37488,37872,38256,38640,39024,39408,39792,40176,40560,40944,41328,41712,42096,42480,42864,43248,43632,44016,44400,44784,45168,45552,45936,46320,46704,47088,47760,48144,48528,48912,49296,49680,50064,50448,50832,51216,51600];
const TEMPOS = [[0,86.0],[5760,80.0],[5952,78.0],[6048,58.0],[6144,82.0],[7584,83.0],[9936,85.0],[16416,67.0],[19536,165.0],[25680,166.0],[36048,88.0]];
const PITCH_BASE = 16;
const META_WIDTH = 2;
const TRACK_NAMES = ["Drums","Slap Bass 2","CALLE GUITAR","DANIEL GUITAR","PITCH DROP L","PITCH DROP R","CLEAN GUITAR L","CLEAN GUITAR R","Guitar Delay","REV/DEL","REV"];
const SECTIONS = [{"bar":1,"title":"Intro"},{"bar":19,"title":"BREAK 1"},{"bar":24,"title":"CLEANS IN"},{"bar":30,"title":"SLIDES"},{"bar":48,"title":"PITCH BREAKDOWN - Bass is dropped to C#0 as well"},{"bar":56,"title":"Chorus"},{"bar":72,"title":"\"When we broke free...\""},{"bar":102,"title":"Section 8"},{"bar":112,"title":"Section 9"},{"bar":128,"title":"Section 10"}];
const ALPHA = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
const LOOKUP = Object.fromEntries([...ALPHA].map((x,i)=>[x,i]));
// Compact reversible event format: delta-onset ticks, duration ticks,
// then two (or three) six-bit characters for [pitch, dynamic, articulations].
// Each track records simultaneous pitches independently, preserving chords.
const PACKED_LZ = "AgDwUAgDwhAgDwngDgDwWAgDwp~ALB~AbB~ALBoWAgDo~AWM~Asj~BdB~Axo~AsKwBwUAwBwhwBwBopwBwB4WAwB4~ARB~AcCkwB~DL_~DL_~BdaG4WGG4ZqBYwUAYwhwE~C2_~EkI~EeBwW~EqBWA~EvFe~EfL~DC2Q4UAQ4pwBQ4UQQw~AEEWAQwk~AQG4WAQ4~AQGwB4U~GxFo~CeB4~AGB~C1H~AXC~HqH~DGC~ARD~DcG~DRCU~DRB~D-gQweQQwW~AEBgD4UAgD4h~DTGk~DpG~ALC~AWEM4UMMwUkBMwdMMwdkBMwbMMwbkBMwUAMwpM~AIChk~B1B~KGD~AUCrMMoUAMol~AcB~CcB~AhBb~C9CAwB4ZwBI4UAI4hIIwU~AEBY4U~AVB~ARG~ImBkYYwUY~AdBYwWAYwkgD~A7Ck~A7o4WAY4kYY4UAY4p~AIDhwBYwe~BQx~CLwAYw~B6I~CPCYMwWAMwhM~FzB4WAM4~AMIl~AMC~AkEw~AMEr~AMC~AkI~AMWM~HGB4bMM4ZMIwUAIwhAIw~C2HwUY~AYGp~AYI~DONgDIwW~AmJ~AhNY4l~HgE~AmV~BYK~AdN~I0EpoFY4W~CdD~CZJ~F8B~BSL~CZ_~BHB~BtK~Bos~BCO~I4B~T1C~IJE4DY4nY~CRBY4eY~XWEkw~UeE~ApEoC~NFJ~M6F~DB_~AhS~KhC~MrEoC~LCKhoX~CsEZ~PQGhAwB4~SMB~V0D~HDI~TKC~bAG~AMC4~AMD~bdL~H9J~BRIA~XKC~A5E~BiCoU~XnG~BzM~AiN~BbD~BQH~VrC~ARHn~BEGk~BEGg~WNC~W7C~DwH~W6G~ZvI~D7q~DTB~AdE~X_H~A_H~YEFk~gPH~CjG~EPp~YrIUgD~DQF~ALG~EDM~AyEE~Hs_~Hs_~Hs_~Hs_~Hs1~caC~c-B~XaD~AIB~X2C~AUH~ID_~IDV~FaB~H-C~hhIgJ~jfCh~jjDwUwBQopgBQ4UgC~jmCpgDQoUAQohAQo~kRFhQQwUAQwpwC~AxC~AOBkwB~AsCk~kTD~k4C~BaBAQwh~BPD~BCNwpQ~BkDgC~lgGpQQweg~BSE~BKB~lmEAQw~BAE~AQJQQ4W~AQEgBQoWgBQwW~BEE~CoB~AOBWgB~ChD~DeM~CpG~C2F~EUE~AOBe~EYI~CRE~D0F~AQge~ChE~E7E~AmC~BvEk~D-E~E7J~BuF~A-K~ANDegC~EdG~CdCC~HDD~A9B4CIoUAIoWIIwWII4WI~IIEc~INBgDwBgc~OPBcAwBo~ARH~JMC~AnM~ARe~BJu~CRI~QfF~BY_~BYH~BT_~D0j~OUC~AQB~VTJ~OeF~A8I~WmN~B_h~C3IWA~BIF~xGH~Fy_~EfR~BdL~A3B~AsE~AMEgDocgD~uFCcYYwWYY4W~AIDcAY4dYYwdY~AIG~AoI~AUQbYYwbYY4b~AUD~AMBYYobYgBwUAgBwkgBgBoUAgBo~ALB~AWHgUAgBg~AWW~0nDngM~jpE~-HI~ALB~ARB~anD~ALBpgG~AXG~AGB~A5C~V2DE~VqL~IUB~d-H~n6B~JtC~BgC~A4BW~d0B~CCG~BaCopwEQgWQQo~3XC~BFE~CDC~I5CgGgD4WAgD4~7LJJ~5NG~fOB~cSC~C1dpgD~xFCW0~qMF~ETM~A2E~e6C~C4SgGgB4UAgB4pgC~ALEn~GIL~AWC~GeM~AWE~A3F~AhM~AsIWg~c0G~EVBbAwBwd~CyBZAwBwb~DtG~L7H~GBB~HsI~HbC~FdD~DIF~D7O~_NIgG~AzEk~hkC~k3K~Hl_~HlS~DxH~LBE~AWH~m-I~H1I~LBG~H6G~mmE~K0N~IE9gBw~H5BwU~GyBd~AGBb~AGBW~HlGhwEQ4U~fADUQ~HbE~HKC~HVaMwUAMw~ldK~1GDwr~CbF~tsN~ChC~CsI~EpF~AyH~E_I~okD~lZL~M_K~3IDpYYwUoC~1OD~ANRW~ANC4U~3rG~FbI~nnF~B3OWwB~A_FwUwBY4UY~fmD~FBF~qJC~gSC~AWM~FdG~F_Fp~ALCg~DQF~KzC~iBC~A_H~FM_~FM8wB~AOB~AbE4~FNM~IPChAMwk~twM~IjK~7yN~GgEgWYYoW~AZDk~a1C~8XK~-nFY~ptCW~p1C~Fut~C5CkwBMYpMMQpMMgpM~AMBo~AMDw~AMC~CADwB~DeG~LxL~wID~TaC~FYB~iFChwB~D6M~QrEh~ejB~AGBwWAgDw~ARF~G9G~z7G~ARC~G4H~AiI~AMH~H8J~AdM~A6H~V_D~ICGbAwB4d~ALBZAwB4b~C6B~0kN~DqBY~DYQYwWAYwh~QSEn~QSPk~G5F~EAC~EhS~BJF~AfS~DkH~JdN~3pB~CxK~AINwWAMw~Akb~BIP~WaK~EdL~AEE~CQv~H-H~GcC~IwX~J_D~AfIkB~OaH~J5c~iUCh~iZBwE~CeCe~CiN~biEkwEMwWMMoWM~aHD~BDG~CtC~QJH~G0C~Q1Ek~MrEpMM4b~A_FM4dMMwd~AUDZ~-FK~FEU~GwB~RNa~BIC~AkD~BI3~HkM~FTE~_xC~MiWAM4~QQOE~caYf~AdYK~BXU~pAG~MXR~YCE~BcQ~A7C~BZC~BVU~S9G~ALC~iAB~CKYIwUAIwkAIwpIIwUII4U~AIJ~WDCM4W~B1Z~CVe~aZF~YNCWYYoUAYo~YIFwBYwWY~Cs_~CsX~LQG~GpB~aUD~bBF4D~vuBDkB4UAkB4WAkB4ekB~KXB~L_FWMM4nM~aUEl~tFC~AGE~ITXgV~AdCk~AhNgM4UAgM4kAgM4pwT~BFR4U.AwB4I~FSB~AGN~AY_~AYCE~AMB~AGN~AY_~AYC~Co_~DA_~AYj4E~uOB~Cc_~C0_~F0_~DA_~DA_~F0d~AGJI4IIIwIII4II~CEC~ASIY4IYY4IYwE4IwE~AsioC4IoC~A2C8~A2l~BizH8IwH~AkFwIIYwIY~AQJ~BFJ~ARCgDI4AIIw~AED~AMHwB4AwE~AeUY4AwB~AdZYwAgG~AWB~AEDY4A~BuD~ARG~BEW~B_h~DLG~AMI~EuL~Aed~FME4D4Io~AOB~FWCwBo~AqB~CD_~AeK~HpF~AmBY4AYY4AoXwB8PwBgD0MwNgD4A~bMBAwBY0U~bHBgD4UgG~MeK~AMKgMgDwAgV~aeCwB8WwB~ASBD~AGC~A8ZGgDwAwKgM~CA8wEgG8AgGwK8MwK~CMxDgDwM~hWBAgJwB4J~AYBJwCgC4MgCgCoLgCgBgLgBgC4C~AMBCgBQ4JQwC4JwDwB4NwBgC4NgC~BeDC8NgDQ4CQgB4CgBwBgCgCgC4CwCwB4N~AMB~AGB8NgCgD8NgD~AqCgB5CgBQ5A~9yBHwBwBkH~BdBIgCgBkI~AYB~CjXQ4CQQwCQ~AIO~CvWgCwPwCQwQ~AuB~CzawG8NwDgDwY~4UBNAgDo~ALBwNA~AW_~AW_wYgDwEoAAgDoN~xyBN~HwBNAwBwYwB~B0_SwAAgDwNgDgPoNgP~AiF~AzC~AM_~AGEwEoA~ZIB~C5B~AwegkBwAgwBgD4EgDwE4EgGgD4CgMwE~f4BE4PwEgD4JgDwB5JgD~AeB~AqB~AeBE~AeDY~BCC~AGEg~AMCV~AqBJ~AqB~AGCC~BUJ~BsC~BOMCgkBgD4NgDgG4N~AlB~N3B4M~ASBMgG~BPCgG4JwK~BDT~CRR5A~CRNU~CRjMwAM~AEIYwAwrBwB4C~IuBAwHwB4D~AMB~ASB4A~A7B~SqEHY4AYoC4Ao~Y_B4GwBwT~VhCQwTQQoUQQwTQwBoUwB~ASOgBwT~tkG5AgBgD4AwEQ5AQ~AEE~CML~QNBw~CSB~CMNwAYoCwAoC~AKHxIYoCx~eyB~CqDLQwAQ~AEE~BYB~CILx~R3Bw~JyB0TwBM4~EgD~AIDY4AgJ~vABo~3jDo~wJBgSwB4M~CgB~AGB~AMD~VuO~DEC~AGB~AMC4A~DiD~ASD~ByQD~ByQD~AqMM4AYwB4AoFMwTMMoTM~AIEYwTwE~AvJ4AM~B7E~YZW~AGH~AqCT~AeB~AGB~AMI5~AeB5~DPB5AwBM4IMMwIM~AIEYwI~CuSY~Cti~EGD~Fjp~AGI~FdD~FpF~BdPwE~MOQf~AVQK~GiS~AVj~B-S~BUQ~kNH~AILY~DFW~Bcg~ELC~BdU~EjS~A0C~BXHYY4AY4GwA4G~C8R~NXE4~PfF~EiQV~A8QT~AVP~8kB~jaBo~AGB~jmCog~AMB~AGBob~AMB~AGBoX~AMB~AGB~AMm4Q~AMB~AGBw~AMC~Bg_~BgH~DAO~BUHs~BsIc~AMB~AGB~B4J~AMOZ~AMG~DAO0n~AMB~AGC~BUHwj~AGGo~AMTwh~AGM~GA_~GA_~GA_~GASi~AMB~AGB~GAC4~GAU~AYC~FKC~AYH~GAsy~AGBq~AMTobA~GRFbA~A0E4bAwB4jwBI5MAI5VIIxMAIx~AIGwBxMAwBxV~AjWYxMAYxVYY5MAY5VYwE5MAwE5VwE~BW_~BWEoC5MAoC5VoC~Bp_~C__~C_-H5MAwH5VwH~BGc~AgbwB~AZM~AhLgDI5MIIx~AEL5MIwB5M~DpB~AeRY5M~DjB~AdWYxMgG~AiIYxM~BuKYx~BEX~B_Xx~B_G~D8R~AIUwB5MAwB5~GdX~A73~G9E~AIE4D5MA4D5Vo~AbF~HrH~BRK~DkZ~EB_~CjL~JzP~AIDoXwB4~RGB~AGC~RSC4rwBgD8rgDgD8m~AGB~AMB4~_MB~kfC6~0KBwg~AkEwB4UAwB4gA~BMFUAwBwgA~BWF~AgGm~AgL~AQB~AgM~BiC0f~CGT~C2as~A2KwB4~XsB8i~3ABM~BIH~C2_~C2O8~C2B~BoC~FIG~BUF~Fsa~AGB~Fs_~Fs_~Fs_~Fs_~C2a6Y~EqCgDgD6XgDgDyXw4CgD4kAgD4~CkBwkAgDw~DTC~AWGokAgDo~AWM~AsIl~AWDwEonAwEorwEwBgkAwBg~ECB~BYxwB4kA~FECwBwkAwBwrwB~ZuEUwE~AhH~BCJ~ALd~BjbgS5MAgS5UgS~Eef~AhbwBwl~C7E~ALHE4nAwE4~EpB~AWF~BCJ~F2e~BjG~Ep_~BjcokAwBo~BjB~BNGe5MAge5UgoLM5MMMxMM~AIEY5MwrBwB6O~AzBM~B7BnwBgDok~AMB~KbBok~AeBP~AGB~AqFwB6sAwB6w~DRBsAwBww~MlE~AiCY6sYoC6sAoC4woCgDwsYoC4roCY4MYoC4MoCYysYoCyroCY~AeByroC~QrI~AGIYwgYwBwfwBY4MYQ4fQQwgQQwfQ~r_C~ASF4~ASEgB4fgBgBwg~1gBMg~C8ZQ5MQQxMQQ5MQ~EUj~_aBy~EaC~BYCrAwB4v~AjBrAwBov~EUL~DwG~AKG~EOG~AKG~bUBU~bvFU~AdI~SWEwgwBY4gYoCymoCY4fYoCynoCQ5MAQ5UQQxMAQx~AIG~e5EU~EaY4sAwB4~EaB~ALIMwBM5MAM5UMMxMAMxUM~AQM~C0DgJM4rAM4sMMwrAMwsM~AQMY4rAY4swEwBys~GDC~FIB~AMPAwBwtAwBwu~AWC~ALb4Y~A3B~AGB~AMC~zQC~AGC~zQC~G1Cw~AGB~AMCx~D5B~jVF~ALH~DzkDM5gMMxgM~AIEY5ggD~A-c~AQD~HlHF~E7l~Bcc~HsH~aoK~ajH~AWGy~AWR~AsH~BNIf~b6Lf~b6L~Agb5MwE~EnB~AEHY4~Ev_~Ev4~HJD~KTG4tAwB4~JgC~JbC~ARX~KoC~KHG~AQc~KnO~KbD~KnZw~KnbV~DODV~DeD~AQG~siD~EHB~YBNf~AVQK~BTj~G2E~Ap_~ClE~DOl~Ckk~xtX~0Qa~FZq~JghH~X3G~BMF~AIM~BcD~3zg~_LV~Ibl~ArX~4WNG5MA4G5V4G~Dvk~ZoF4~ZoF~IwkV~BkkT~BSdxMAYxV.A~NhEo~NnH~AMa~Awa~ASO4Q~ASB~AGBw~AM-~hZB~P3Cw~hlC~DAr~AMmsb~DAS~AGg~AwIq~AeI~DAN~C0_~Gwa~Foy~lOFwBo~EIBw~AGBoX~AMB~AGB~AMC4~AMH~AYI~AMC0~5WHoc~AGH~BOB0~BmHw~AeH~BsD~GAT~AMU~GAU~AMKA~DRFQA~BqE4QAwB4b~RWEU~Q2D~AIGwBxMAwBxU~AjW~NTCU~QbDUY~zIH~BW_~r9Q~Bp_~C__~C_9H5MAwH5UwH~BGc~AgbwB~AZM~AhLgDI5MIIx~AEL5M~YeB~DpB~AeRY5M~DjB~AdWYxMgG~AiIYxM~BuKYx~BEX~B_Xx~B_G~D8R~AIU~qgH~A7_~FRN~G9D~AIE4D5MA4D5Uo~AbF~HrH~BRK~DkZ~EB_~CjL~JzP~AIDoX~uQE~uWD~AMCrwBgD8rgDgD8m~AGB~AMB~6xG~97CgDwg~AkEwB4U~viLU~wCL~AgG~8tB~AgH~AQB~AgM~BiC0f~CGT~C2as~A2K~8cE8i~95E~BIF~C2_~C2O8~C2B~BoC~FIG~BUF~Fsa~AGB~Fs_~Fs_~Fs_~Fs_~C2a6Y~EqCgDgD6XgDgDyXw4CgD4kAgD4~CkBwkAgDw~DTC~AWGokAgDo~AWM~As_~Asl~ZjHwB4kA~FaE~A3H~ALd~CERS5MAgS5UgS~Cwf~DR_~As7~EI1~CEce5MAge5UgoL~7RQrBwB6O~JcBM~BwBnwBgDok~AMB~JkBok~AeE~AGLsAwB4w~KnB~_DBw~LuE~AiCY6sYoC6sAoC4woCgD~AQB4roCY4MYoC4MoCYw~32E~4AG~BgF~NEB~AGGY4gYwB4fwBY4MYQ4fQQwfAgBwgQgCofQwBygwB~AYU~1xEw~1xF~DIP~ALFQ5MQQxMQQ5MQ~EgjTwBwBy~yOC~BYCrAwB6r~AjBrAwBq~HQC~EgG~DyF~AKH~EaG~AKG~bEP~AdF~QDC~AGCY4gYoCymoCY4fYoCynoCQ5MAQ5UQQxMAQx~AIG~eOH~EaW6sAwB6~HiK~AcC~6EjgJMwrAMwsMM4rAM4sM~AQMYwrAYws~L1Bs~FCB~AGB~AMOwrA~CGE~AcC~AQC~ALW4Y~A3B~AGB~AMC~4lC~AGC~6XD~G1Bw~AGB~AMCx~D5B~EcF~ALH~DzkDMxgMM5gM~AIEYxggD~A-c~AQD~HlHF~E7l~Bcc~DQJ~ZtH6~aIH~aDH~AWR~AsH~BNH4f~bPLf~bPL~Agb5MwE~ErB~AEHY4~Ev_~EvQ4rAY4~Evf~HJDwE~KBGA~KSM~ARW~KoC~KHG~AQc~KnO~KbD~KnZw~Kn8~EHB~YNNf~AVQK~L6m~Ap_~ClJ~DOl~Ckk~xCX~zla~FZq~AphH~X3G~AjF~AIM~PCO~DAs~Ibn~ArX~3rNG5MA4G5U4G~F6l~ZoE4fAgB4~ZtF~I1kV~BpkT~ApdxMAYxU.gtQwB4VwBgC4VwCgC6WgCgD6W~lMBJgDQ4VQgDyVwDwB6lwBgC6lg~dzD~tqCQ4JQwC4JgDwC4J~BEBXg~AGK~uSCB4J~DxB~AGGD6T~uwBT~gQB~CGRQ4JQQw~AED~AMIwVAQwhQgD0VAgD0h~ChQwBynwBgBingBQwjAQwo~BFB~CvUwD6XwvGgD4cAgD4gAgD4ngDwEwcAwEwgAwEwngGgD4QgDwE4cAwE4gAwE4nwE~AQPS~AGBbwE~FMCgD5~AGB~A-S~BkI~AyBVgDgJ6bgJgG6bgG~AGD~CcLgGwcAgGwgAgG~CcDh~BeBJ~B8B~AGCQ~CIJ~DAV~CCNQ~CCR~AGBwB6b~G2Bb~DSBNgDgG4N~CgC~ASB~ChBk~AXBgAgG4kgG~CQC~EMEgJgD4D6~DsF~CQ1~ESd5J~ESM6g~AGB~ESI~CC4~ESL~NW_~NW_~NW_~NW_~NW_~NW_~NW_~NW_~NW_~NW_~NW_~NW_~NWvwuHwBo~s1B~AGV~6OC~AMXYomYYonYwBo~p8B~AGV~61D~AGH~B6a~AGO~BCO~AGa~DC_~BKC~xZC~A4C~AMP~BKB~AMb~BIC~CeH~AM5~CiH~AMh~Bgs~Dw_~Dw_~Dw_~AMK~IGU~CQ_~GA_~GA_~GA_~Dw3NgDyzgDwBgzwB~AGCoCizoCwBy0wBYg0YgDg0~AiB0wBgDi0gDgDy5gDgDi5gDQwzQgByzg~A-D~AGIgCizgCgBy0gBYi0Y~BOV4~BOB~AGB~CO_~COgg~COE~BCCgxAgGg4gDgGowgDgG~ARd~AzDxgDwEgwAwEg~C5BoxwBwEgxAwEgxwB~A-EwxAgGwx~BPG~AMND~BWDwAgGgwAgMg3~AWGowA~B3E~AnL~CTC~AWO3~C6Hs~C6Gr~AR0~D-EwE~D-FwBg4wBgDow~FiBxAgDg~D-C~EPC~D-B~DnDAgDoz~E2ED~C0Cgw~AyB~AQJ~D7q~AnH~AW_sA~FYPrA~Ag_~Ag_~AgdG6z~gvBzgGgJ4~FsB4xgDgbo~LhB4~HNB~AkI6zgGwEot~snB2~QVB0AwBo0wB~BNygG~BNBY62~BrZ4~BrDgY~BrO~CUSN~ApHP6z~neB~Dbu~Bwd~CZt~BS_~DrMW~ApSgS~ApBP~FbK~oN_~oN_~oN_~oN_~oN_~ed_~AMl~iN_~AMZ~Dw_~Dw_~Dw_~oN_~CQ_~GA_~GA_~GA_~oN_~l__~oN_~CO_~oN_~oN_~oN_~oN_~oN_~oN_~oN_~AW_~mN_~Ag_~oN_~oN_~oN_~oN_~oN_~m7_~BS_~oN_~oNVgw~oN_~oN_~AGk~oN_~DCogD~eX_~eL_~iH_~iH_~Dw_~AMv~GSI~oH_~IAO~GA_~GA_~GA_~GA_~AMJ~ASD~Dqb.wuZgGq~RSB~AGBJ~eoBboxgDwc~VhCo~VhB~AkIq~S9Hq~Y8M~BNT0B~BOYgY~BOE~BsZ4wBwTo0AwT~BsO~ApEAwE~BqC~CaBN~ZCH~AoBPqzgJ~Dht~B1m~Cju~Bc_~BcyHotAwH~AuE~EKBkwBkBotAYo0YoIo0Y0CokA0Com0CMokMgDwkAwEwmgDYokY~AEB4kAY4mAgD40~ANBgD4s~AaB4D~AjBmYoCosAoCosoC~AuHs~AuBoC4nYwB~AKCrwBYgkAYgmYYgkAoCgnAYgrYwBgkAwEgr~AFB~JxBkA~NcCgD~ALFwB4nA~AFE~AmB~AQUgD~AQCon~A7JH~AmEwBwE4rgD~AMD~BYl~DDDonAYonYoC4mAY4nYoC~FZDmYgDon~FVGoCoFonM~Faen~ANBwB~FaD~D1BYosYYom~AIB~FiJ~FeD~FaB~FVEmYY~FMDgDgrAgDg~DfD~Eh_~Eh_~Eh_~Eh_~Eh_~Eh_~Eh_~Eh_~Eh_~EhP4G~EhGgD4rgD~DrJ~BxD~DsE~AZBMonMMgnM~DzF~BQDYonY4D~D8R~A4B~AIF~EEM~SgFg~SgR~D8_~Id_~Id_~Id_~Id_~Eh_~Eh_~Eh_~Eh_~M-_~M-Y~Dr_~Dr_~Dr_~IM_~IM_~Eh_~Eh_~EhPgD4nA~EVG~AmB~j-pJ~EaIY~EZD~Fs_~Fs_~Fs_~Fs_~a2_~a2_~a2_~OJ_~OJYg~EZC~I0_wB4m~AYBYYok.wmj~vZBgD~yAl~x7_~x7_~N9f~Tv_~OD_~OD_~OD_~Eh_~Eh_~Eh_~Eh_~Eh_~Eh_~Eh_~Eh_~Eh_~XF_~XF_~XF_~D8_~Id_~Id_~Id_~Eh_~Eh_~Eh_~Eh_~Eh_~M-_~Dr_~Dr_~Dr_~IM_~IM_~Eh_~Eh_~EhW~x7_~x7_~Fs_~Fs_~Fs_~a2_~a2_~a2_~D8_~x7_~I0y~x7J";
function unLZ(src) {
  const out=[];
  for(let i=0;i<src.length;) {
    let ch=src[i++];
    if(ch!=='~') {out.push(ch);continue;}
    const distance=(LOOKUP[src[i++]]<<6)|LOOKUP[src[i++]];
    const length=LOOKUP[src[i++]]+4;
    if(distance<1||distance>out.length)throw Error('Corrupt compressed score');
    for(let j=0;j<length;j++)out.push(out[out.length-distance]);
  }
  return out.join('');
}
const PACKED = unLZ(PACKED_LZ).split('.');

// Decode VUInt (5-bit little-endian chunks, high bit 32 = continuation).
function unpack(part) {
  let pos=0,prev=0,events=[];
  function read() {
    let number=0,shift=0,n;
    do {
      if (pos >= part.length) throw Error('Truncated note data');
      n=LOOKUP[part[pos++]];
      number += (n & 31) * 2**shift;
      shift += 5;
    } while (n & 32);
    return number;
  }
  while(pos<part.length) {
    prev += read();
    const length=read();
    let bits=0;
    for (let j=0;j<META_WIDTH;j++) bits|=LOOKUP[part[pos++]]<<(6*j);
    const pitch=PITCH_BASE+(bits>>6);
    const dyn=(bits>>3)&7;
    const flags=bits&7;
    events.push([prev,prev+length,pitch,dyn,flags]);
  }
  return events;
}

const METERS = TEMPOS.map(([tick,bpm],i)=>{
  return [tick,bpm,0];
});
for(let i=1;i<METERS.length;i++){
  const [tick,bpm] = METERS[i];
  const [priorTick,priorBpm,priorSec] = METERS[i-1];
  METERS[i][2] = priorSec + (tick-priorTick)*60/(TPQ*priorBpm);
}
function tickToSec(tick) {
  let lo=0,hi=METERS.length;
  while(lo+1<hi){let m=(lo+hi)>>1;if(METERS[m][0]<=tick)lo=m;else hi=m;}
  let [anchor,bpm,time] = METERS[lo];
  return time + (tick-anchor)*60/(TPQ*bpm);
}
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

const DRUM_SOUNDS={36:'bd',38:'sd',40:'sd',41:'tom',42:'hh',43:'tom',44:'hh',
  45:'tom',46:'oh',47:'tom',48:'tom',49:'cr',50:'tom',51:'rd',52:'cr',
  53:'rd',55:'cr',57:'cr',59:'rd'};
const CHANNELS=[10,1,2,3,4,5,6,7,8,9,11];
const VELOCITY=[.18,.25,.34,.47,.59,.71,.83,.94];

// Pure pattern; Strudel's scheduler queries only the relevant note onsets.
// A Hap has independent whole and part spans: do not re-trigger a tied note.
function scorePart(track,midiMode){
  const notes=SCHEDULES[track];
  const maxDur=notes.reduce((m,n)=>Math.max(m,n[1]-n[0]),0);
  function lowerBound(x){
    let low=0,hi=notes.length;
    while(low<hi){let mid=(low+hi)>>1;if(notes[mid][0]<x)low=mid+1;else hi=mid;}
    return low;
  }
  return new Pattern(state=>{
    const begin=Number(state.span.begin),end=Number(state.span.end),out=[];
    if(!(end>begin) || !(LOOP_LENGTH>0))return out;
    const firstLoop=Math.floor((begin-maxDur)/LOOP_LENGTH);
    const lastLoop=Math.floor(end/LOOP_LENGTH);
    for(let k=firstLoop;k<=lastLoop;k++){
      const shift=k*LOOP_LENGTH;
      const first=lowerBound(begin-shift-maxDur);
      for(let i=first;i<notes.length;i++){
        const [s,e,pitch,dyn,flags]=notes[i];
        if(s+shift>=end)break;
        if(e+shift<=begin)continue;
        const a=s+shift,b=e+shift;
        const whole=new TimeSpan(a,b);
        const part=new TimeSpan(Math.max(a,begin),Math.min(b,end));
        const velocity=VELOCITY[dyn]*(flags&1 ? .65 : 1);
        const value=(track===0&&!midiMode)
          ? {s:DRUM_SOUNDS[pitch]||'hh',velocity}
          : {note:pitch,velocity};
        out.push(new Hap(whole,part,value));
      }
    }
    return out;
  });
}

// WebAudio approximation: replace samples / gain / effects to taste.
function webPart(i,p){
  switch(i){
    case 0: return p.bank('RolandTR909').gain(.58).orbit(0);
    case 1: return p.s('gm_synth_bass_1').lpf(2200).gain(.65).pan(.5).orbit(1);
    case 2: return p.s('gm_electric_guitar_muted').distort('3:.32').lpf(6000).gain(.34).pan(.17).orbit(2);
    case 3: return p.s('gm_electric_guitar_muted').distort('3:.32').lpf(6000).gain(.34).pan(.83).orbit(3);
    case 4: return p.s('gm_electric_guitar_muted').distort('3.5:.3').lpf(5300).gain(.28).pan(.12).orbit(4);
    case 5: return p.s('gm_electric_guitar_muted').distort('3.5:.3').lpf(5300).gain(.28).pan(.88).orbit(5);
    case 6: return p.s('gm_electric_guitar_clean').room(.42).gain(.43).pan(.2).orbit(6);
    case 7: return p.s('gm_electric_guitar_clean').room(.42).gain(.43).pan(.8).orbit(7);
    case 8: return p.s('gm_electric_guitar_clean').delay(.36).delaytime(.3).room(.48).gain(.28).pan(.6).orbit(8);
    case 9: return p.s('gm_electric_guitar_clean').delay(.45).delaytime(.4).room(.65).gain(.30).pan(.28).orbit(9);
    default:return p.s('gm_electric_guitar_clean').room(.7).gain(.30).pan(.72).orbit(10);
  }
}

// Inspired by the MIDI-routing structure of the Meshuggah Strudel cover
// (Alvaro Caceres): https://github.com/alvaro-caceres-munoz/live-coding-metal
const parts=TRACK_NAMES.map((_,i)=>scorePart(i,MIDI));
$score: MIDI
 ? stack(...parts.map((p,i)=>p.midichan(CHANNELS[i]))).midi()
 : stack(...parts.map((p,i)=>webPart(i,p)));