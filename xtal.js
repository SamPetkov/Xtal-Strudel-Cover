const drumstruct = "Rolandcompurhythm78"
const kickstruct = "Rolandtr808"

setCps(114/60)

$xtal: arrange(
  [2, note("[g2, a#2]").clip(".5")],
  [1, note("[g2, d#2]").clip(".5")],
  [1, note("[[g2, d#2] [g2, d#2]]").clip(".5")],
  [1, "~"],
  [3, note("[g2, d#2]").clip("<.5>")],
  [1, stack(
      note("f2").clip("1"), 
      note("a#2")
    ).s("xtal:1").room(1.2)
    .gain(slider(0.4346, .2, .8))
    .hpf(400).color("red")
    .transpose(-8)
    .speed(0.8)
    .orbit(4)
    .punchcard()
  ]
)

$hats: s("hh hh oh ~")
  .bank(drumstruct)
  .room(1.05)
  .hpf(10000)
  .gain(perlin.range(.3, .4))
  .color("white")
  .delay(0.2)
  .size(1.5)
  .decay(.15)

$bd: s("bd:3").bank(kickstruct).room(.3)
  .delay(0.4)
  .gain(.8).color("blue")
  .punchcard({
    flipTime: 1,
    minMidi: 5
  })

// NEW BASSLINE SECTION
$bassline: arrange(
  [9, note("<G2@2 D2@6 F2>")],
  [9, note("<G2@2 D2@6 c3>")]
).s("sawtooth").lp(1200).decay(0.2).gain(slider(0.4346, .2, .8))
