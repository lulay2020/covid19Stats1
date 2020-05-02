let checkbox = document.querySelector('input[name=theme]');
let trans = ()=>{
	document.documentElement.classList.add('transition');
	window.setTimeout(()=>{
		document.documentElement.classList.remove('transition')
	}, 1000)
}

// dark mode section
checkbox.addEventListener('change', function(){
	if (this.checked) {
		trans()
		document.documentElement.setAttribute('data-theme', 'light');
		sessionStorage.setItem('mode', 'light');
	}else{
		trans()
		document.documentElement.setAttribute('data-theme', 'dark');
		sessionStorage.setItem('mode', 'dark');
	}
})

function isDark(){
	let mode = sessionStorage.getItem('mode');
	if (mode === 'light') {
		document.documentElement.setAttribute('data-theme', 'light');
		checkbox.checked = true;
	}else{
		document.documentElement.setAttribute('data-theme', 'dark');
		checkbox.checked = false;
	}	
}

// common functions

async function getData(){
	const response = await fetch('https://corona.lmao.ninja/v2/countries');
	const data = await response.json();
	return data;
}

function getOptions(){
	let output = '';
	getData()
	.then(response=>{
		response.forEach((country)=>{
			output += `<option>${country.country}</option>`
		})
		select.innerHTML = select.innerHTML + output;

	})
	.catch(err=>{
		console.log(err)
	})
}

function isZero (num){
	if (num > 0) {
		num = '+' + num;
		return num;
	}else{
		return num = '';
	}
}