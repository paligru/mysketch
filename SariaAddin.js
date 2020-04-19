var navControlContainer;

$(document).ready(function () {
    CreateControl();
    Microsoft.Dynamics.NAV.InvokeExtensibilityMethod("AddInReady", null);
});

function CreateControl() {
    navControlContainer = $("#controlAddIn");
    navControlContainer.append('<div id="sketch-holder"></div>');
	navControl = $("#sketch-holder");
}

//--- SCRIPT ---
getCSVData().then(data=>{
    const xs = [];
const ys = [];
const ys2 = [];
    let lines = data.split('\n').slice(1);
    lines.forEach(line => {
        const values = line.split(';');
    xs.push(values[0].toString()+'/'+values[1].toString());    
    ys.push(parseFloat(values[2].replace(',','.')));		
    ys2.push(parseFloat(values[03].replace(',','.')/100));
    });
    makeChart(xs, ys, ys2);
});


async function getCSVData(){  
const csvdata = await fetch('http://intranet.saria.es/sitios/informatica/aplicaciones/SiteAssets/AVF_COMPANY_SALES.csv'); 
const txtdata = await csvdata.text();
return txtdata;
}

function makeChart(pxs, pys, pys2){
    const ctx = document.getElementById('chart').getContext('2d');			
    const myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: pxs,
            datasets: [{
                label: 'Cantidad',
                data: pys,
                fill:false,
                backgroundColor:'rgba(255, 99, 132, 0.2)',
                borderColor:'rgba(255, 99, 132, 1)',
                borderWidth: 1
            },
            {
                label: 'Importe/100',
                data: pys2,
                fill:false,
                backgroundColor:'rgba(123)',
                borderColor:'rgba(125)',
                borderWidth: 1
            }]
        },
        options: {
            title: {
                display: true,
                text: 'Evolución de la venta'
            }
        }
    });
}