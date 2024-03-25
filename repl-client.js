var net = require('net')

var sock = net.connect(1337)

process.stdin.pipe(sock)
sock.pipe(process.stdout)

sock.on('connect', function () {
  console.log('\nSOCKET CONNECTED\n')
  // process.stdin.resume(); // when starting nodejs app, process.stdin is paused by default
  process.stdin.setRawMode(true)
})

sock.on('close', function done () {
  console.log('\nSOCKET CLOSED\n')
  process.stdin.setRawMode(false)
  process.stdin.pause()
  sock.removeListener('close', done)
})

process.stdin.on('end', function () {
  sock.destroy()
  console.log()
})

process.stdin.on('data', function (b) {
	console.log('b:', b[0])
  if (b.length === 1 && b[0] === 4) {
    process.stdin.emit('end')
  }
})