const 	select = document.getElementById('country'),
		tableData = document.getElementById('data'),
	 	btn = document.getElementById('btn');

let 	xLabels = [],
		yCases = [],
		yDeaths = [],
		yRecovered = [],
		output = '';

window.onload = ()=>{
	getOptions();
	btn.onclick = (e)=>{
		const selectedCountry = select.options[select.selectedIndex].text;
		checkArrays();
		getCountryData(selectedCountry);
		chartIt(selectedCountry);

		e.preventDefault();
	}
};


// creating the chart
async function chartIt (selectedCountry){
	await getHistorical(selectedCountry);
	const ctx = document.getElementById('myChart');
	Chart.defaults.global.defaultFontColor = '#fff';
	let myChart = new Chart(ctx, {
		type: 'bar',
		data: getChartData(),
		options: {
			responsive: true,
			legend:{
			    position: "right"
			},
			title: {
			    display: true,
			    text: `Covid-19 stats in ${selectedCountry}`
			}
		}
	});
}

function getChartData(){
	return{
			labels: xLabels,
			datasets: [
				{
				    label: "Active Cases",
				    backgroundColor: "#ffcc00",
				    data: yCases,
				    fill: false
				},{
				    label: "Total Recovered",
				    backgroundColor: "#00bb7b",
				    data: yRecovered,
				    fill: false
				},{
				    label: "Total Deaths",
				    backgroundColor: "#990000",
				    data: yDeaths,
				    fill: false
				    }
				]
			}
}

// requesting & dealing with APIs

async function getCountryData(selectedCountry){
	try{
		const response = await fetch(`https://corona.lmao.ninja/v2/countries/${selectedCountry}`);
		const data = await response.json();
		output=`
		<tr>
			<td>${data.country}</td>
			<td class="special">${data.cases}<span class="green">${isZero(data.todayCases)}</span></td>
			<td class="special">${data.deaths}<span class="green">${isZero(data.todayDeaths)}</span></td>		
			<td>${data.recovered}</td>
			<td>${data.active}</td>
			<td>${data.critical}</td>
		</tr>`;
		tableData.innerHTML = output;
	}catch(err){
		alert('Oops ! Error occurred');
	}

}

async function getHistorical(selectedCountry){
	try{
		const response = await fetch(`https://corona.lmao.ninja/v2/historical/${selectedCountry}`);
	  		  data = await response.json();

		// converting an object to an array
		let timeline = data.timeline,
			casesDate = Object.entries(timeline.cases),
			deathsDate = Object.entries(timeline.deaths),
			recoveredDate = Object.entries(timeline.recovered);

		// get historical data for the chart
		for (var i = casesDate.length-7; i < casesDate.length; i++) {
			xLabels.push(casesDate[i][0]);
			yCases.push(casesDate[i][1]);
		}
		for (var i = deathsDate.length-7; i < deathsDate.length; i++) {
			yDeaths.push(deathsDate[i][1]);
		}
		for (var i = recoveredDate.length-7; i < recoveredDate.length; i++) {
			yRecovered.push(recoveredDate[i][1]);
		}
	}catch(err){
		alert('Error ! can not fetch data.');
	}

}

async function getData(){
	const response = await fetch('https://corona.lmao.ninja/v2/countries');
	const data = await response.json();
	return data;
}

function getOptions(){
	getData()
	.then(response=>{
		response.forEach((country)=>{
			output += `<option>${country.country}</option>`
		});
		select.innerHTML = select.innerHTML+output;

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

function checkArrays(){
	if (xLabels.length > 0) {
		xLabels.splice(0);
		yDeaths.splice(0);
		yRecovered.splice(0);
		yCases.splice(0);
	}
}