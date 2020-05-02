const 	select = document.getElementById('country'),
		worldData = document.getElementById('worldData'),
		btn = document.getElementById('btn'),
		data = document.getElementById('data');

let 	xLabels = [],
		yCases = [],
		yDeaths = [],
		yRecovered = [],
		sortNum = [];

window.onload = ()=>{
	getOptions();
	getAll();
	getHighest();
	chartIt(xLabels, yCases);
}

btn.onclick = ()=>{
	let selectedCountry = select.options[select.selectedIndex].text;
	sessionStorage.setItem('selectedCountry', selectedCountry);
	window.location = 'country.html';
}

// creating the chart section
async function chartIt (xLabels, yCases){
	await getHistoricalAll()
	const ctx = document.getElementById('myChart');
	const myChart = new Chart(ctx, {
		type: 'line',
		data: getChartData(),
		options: getChartOptions()
	});
}

function getChartData(){
	return {
		labels: xLabels,
		datasets: [
			{
				label: "Cases",
				borderColor: "#ffcc00",
				borderWidth: 4,
				data: yCases,
			},{
			    label: "Deaths",
			    borderColor: "#990000",
			    borderWidth: 4,
			    data: yDeaths,
			},{
				label: "Recovered",
			    borderColor: "#00bb7b",
			    borderWidth: 4,
			    data: yRecovered,
			}
		]}
}

function getChartOptions(){
	return{
			responsive: true,
			legend:{
			    position: "right",
			    align: "center"
			},
			title: {
			    display: true,
		       	text: `Covid-19 world data for the last two weeks`
		    }
		}
}

// requesting & dealing with APIs data section

async function getHistoricalAll(){
	try{
		let response = await fetch(`https://corona.lmao.ninja/v2/historical/all`),
	  		  data 	= await response.json();
	  	// converting an object to an array
			casesDate = Object.entries(data.cases);
			deathsDate = Object.entries(data.deaths);
			recoveredDate = Object.entries(data.recovered);

		// get historical data for the chart
		for (var i = casesDate.length-14; i < casesDate.length; i++) {
			xLabels.push(casesDate[i][0]);
			yCases.push(casesDate[i][1]);
		}
		for (var i = deathsDate.length-14; i < deathsDate.length; i++) {
			yDeaths.push(deathsDate[i][1]);
		}
		for (var i = recoveredDate.length-14; i < deathsDate.length; i++) {
			yRecovered.push(recoveredDate[i][1]);
		}
	}
	catch(err){
		console.log(err);
	}
}

async function getAll(){
	try{
		const response = await fetch('https://corona.lmao.ninja/v2/all');
		const data = await response.json()
		let cases = data.cases,
			todayCases = data.todayCases,
			deaths = data.deaths,
			todayDeaths = data.todayDeaths,
			recovered = data.recovered,
			affectedCountries = data.affectedCountries;
		let output = `
			<tr>
				<td class="special">
					${cases} <span class="green">${isZero(todayCases)}</span>
					<p class="red">Cases </p>
				</td>
				<td class="special">
					${deaths} <span class="green">${isZero(todayDeaths)}</span>
					<p class="red">Deaths</p>
				</td>
				<td>
					${recovered}
					<p class="red">Recovered </p>
				</td>
				<td>
					${affectedCountries}
					<p class="red">Affected Countries</p>
				</td>
			</tr>`;
		worldData.innerHTML = output;
	}catch(err){
		console.log(err);
	}
}


function getHighest(){
	let output = '';
	getData()
	.then(response=>{
		// sort cases number in descending order
		response.forEach((i)=>{
			sortNum.push(i.cases);
		})			
		sortNum.sort((a, b) => b - a).splice(50);
		// get data and display it
		sortNum.forEach ((i)=>{
			response.forEach((j)=>{
				if(j.cases===i){
					let flag = j.countryInfo.flag;
					let country = j.country;
					let cases = j.cases;
					let todayCases = j.todayCases;
					let deaths = j.deaths;
					let todayDeaths = j.todayDeaths;
					let recovered = j.recovered;
					let active = j.active;
					let critical = j.critical;

					output += `
					<tr>
						<td><img src=${flag}> ${country}</td>
						<td class="special">${cases} <span class="green">${isZero(todayCases)}</span></td>
						<td class="special">${deaths} <span class="green">${isZero(todayDeaths)}</span></td>
						<td>${recovered}</td>
						<td>${active}</td>
						<td>${critical}</td>
					</tr>`
				}
			})
		}) 
		// sending data to the tbody tag
		data.innerHTML = output;
	})
	.catch(err=>{
		console.log(err);
	})
}

