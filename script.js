const submitCode = (e) => {
    e.preventDefault();
    const code = document.getElementById('code').value;
    const codeOutput = document.getElementById('code-output');
    console.log('code', code);

    if (!code) return alert('Write Your Code!')

    const data = { code };

    fetch('http://localhost:3000/exec-code', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            ['Content-Type']: 'application/json',
        }
    })
    .then(res => res.json())
    .then(data => {
        console.log(data)
        codeOutput.innerHTML = data.output;
    })
    .catch(err => console.log(err))
}