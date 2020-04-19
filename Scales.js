const url="http://10.0.100.114:91/Service1.asmx";

function GetScalesStatus() {    
	const data = "<?xml version=\"1.0\" encoding=\"utf-8\"?>" +
	"<soap:Envelope xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:soap=\"http://schemas.xmlsoap.org/soap/envelope/\">" + 
	  "<soap:Body>" +
		"<GetAllPortStatus xmlns=\"http://tempuri.org/WSBascula\" />"+
	  "</soap:Body>" +
	"</soap:Envelope>";	

	var xmlhttp;
	xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
		if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {            			            
            // Parse response XML
            const parser = new DOMParser()
            const xmlDoc = parser.parseFromString(xmlhttp.responseText, "text/html");
            document.getElementById("scalesstatus").innerHTML = xmlDoc.getElementsByTagName("GetAllPortStatusResult")[0].childNodes[0].nodeValue;
            // Add GetWeight button
            const listitems = document.getElementsByTagName("li");		
            for (let i = 0, len = listitems.length; i < len; i++ ) {
                const comname = listitems[i].innerHTML.substring(listitems[i].innerHTML.indexOf('COM'),6).trim();
                tryGetNAVData(comname)
                .then(ret=>{
                    listitems[i].innerHTML = listitems[i].innerHTML + '  ' + ret + "<button class=\"asbestos-flat-button\" id=\"getweigtbut" + i + "\" onclick=\"GetWeight('" + comname + "')\">Get Weight</button>";
                    }
                )
                .catch(err=>{
                    listitems[i].innerHTML = listitems[i].innerHTML + '  ' + err + "<button class=\"asbestos-flat-button\" id=\"getweigtbut" + i + "\" onclick=\"GetWeight('" + comname + "')\">Get Weight</button>";
                });
            }		
		}
	}	
	xmlhttp.open("POST", url, true);
	xmlhttp.setRequestHeader("Accept", 'text/xml; charset=utf-8');
	xmlhttp.setRequestHeader("Content-type", "text/xml; charset=utf-8");
	xmlhttp.setRequestHeader("SOAPAction", "http://tempuri.org/WSBascula/GetAllPortStatus");
	xmlhttp.send(data);			
}

function GetWeight(pcomname) {    
	const data = "<?xml version=\"1.0\" encoding=\"utf-8\"?>" +
	"<soap:Envelope xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:soap=\"http://schemas.xmlsoap.org/soap/envelope/\">" + 
	  "<soap:Body>" +
		'<getWeight xmlns="http://tempuri.org/WSBascula">' +
		  '<pPortName>' + pcomname + '</pPortName>' +
			'<pScaleType></pScaleType>' +
		 '</getWeight>'+					
	  "</soap:Body>" +
	"</soap:Envelope>";	

	var xmlhttp;
	xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
		if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            const res = xmlhttp.response;				
            // Parse result XML            
            const parser = new DOMParser()
            const xmlDoc = parser.parseFromString(xmlhttp.responseText, "text/html");
            document.getElementById("weightdiv").innerHTML = xmlDoc.getElementsByTagName("getWeightResult")[0].innerText;
            document.getElementById("weightdiv").style.display = "block";
		}
	}
	xmlhttp.open("POST", url, true);
	xmlhttp.setRequestHeader("Accept", 'text/xml; charset=utf-8');
	xmlhttp.setRequestHeader("Content-type", "text/xml; charset=utf-8");
	xmlhttp.setRequestHeader("SOAPAction", "http://tempuri.org/WSBascula/getWeight");
	xmlhttp.send(data);			
}

async function tryGetNAVData(pcomname) {
    // await code here
    let result = await GetNAVData(pcomname);    
    return(result);
}

function GetNAVData(pcomname) {
    return new Promise(function (resolve, reject) {
        const data = "<?xml version=\"1.0\" encoding=\"utf-8\"?>" +
        "<soap:Envelope xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:soap=\"http://schemas.xmlsoap.org/soap/envelope/\">" + 
        "<soap:Body>" +
            '<GetNAVScaleData xmlns="http://tempuri.org/WSBascula">' +
            '<pCOMPort>' + pcomname + '</pCOMPort>' +
                '<pScaleType></pScaleType>' +
            '</GetNAVScaleData>'+					
        "</soap:Body>" +
        "</soap:Envelope>";	

        var xmlhttp;
        xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function() {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                const res = xmlhttp.response;				
                // Parse result XML            
                const parser = new DOMParser()
                const xmlDoc = parser.parseFromString(xmlhttp.responseText, "text/html");                
                resolve(xmlDoc.getElementsByTagName("getnavscaledataresult")[0].innerText);
            }
        }	
        xmlhttp.open("POST", url, true);
        xmlhttp.setRequestHeader("Accept", 'text/xml; charset=utf-8');
        xmlhttp.setRequestHeader("Content-type", "text/xml; charset=utf-8");
        xmlhttp.setRequestHeader("SOAPAction", "http://tempuri.org/WSBascula/GetNAVScaleData");
        xmlhttp.send(data);	
    });
}

GetScalesStatus();

setInterval(GetScalesStatus, 3000);