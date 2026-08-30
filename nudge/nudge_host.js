// nudge_host — EVERY line in this experiment that knows it is living inside
// vampjam is in this file, and nothing outside this file knows the host's name.
// That is the whole point of it: moving the experiment to a project of its own
// is copying the nudge/ folder and editing this one file.
//
// It loads FIRST, before nudge.js, and it does nothing but declare NUDGE_HOST.
//
// What the move has to change, and nothing else:
//   back    — where the corner link goes, and what it is called
//   release — the version stamp in the corner; the host's ship loop writes it
//   store   — the localStorage prefix. Changing it RESETS his saved switches and
//             his last room, so change it only when the move is actually made.
//   sync    — where recorded gestures are read from and parked. Both point at
//             the host's GitHub repo through the host's worker; a new project
//             gets its own pair, or drops the send path entirely (set sync to
//             null and the Send button reports that there is nowhere to send).
//   watch   — the reload-on-change dev loop. It polls the files listed in
//             `files`, so a change to any ONE of them reloads the page; that is
//             what keeps a split page as live as the single file it came from.
var NUDGE_HOST = {
  name: 'vampjam',
  back: { href: '../admin.html', label: '‹ Admin' },
  release: { name: 'nudge_out', bg: '#b45309', fg: '#ffffff' },
  store: {
    takes:    'vampjam_gestures',
    flip:     'vampjam_lab_flip_4',
    flipPrev: 'vampjam_lab_flip_3',
    flipOpen: 'vampjam_lab_flip_open',
    room:     'vampjam_lab_room'
  },
  sync: {
    file: 'lab_gestures.json',
    put:  'https://vampjam-sync.crimson-dust-a18d.workers.dev/',
    get:  'https://api.github.com/repos/mPulseMedia/vampjam/contents/lab_gestures.json?ref=main'
  },
  watch: { on: true, files: ['', 'nudge.css', 'nudge_host.js', 'nudge.js'] }
};
