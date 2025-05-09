
let curp = 1;
let mp = 1;

function ShowTable(dataHash) {
    let html = "";
    html += "<table><tr><th>Растение</th><th>Как за ним ухаживать</th><th>Управление</th></tr>";
    for (key in dataHash) {
        html += `<tr><td>${key}</td><td>${dataHash[key]}</td><td><input type="button" value="Изменить способ содержания" onClick="UpdateCare('${key}')"><input type="button" value="Удалить" onClick="Delete('${key}')"><td>`;
    }
    html += "</table>"
    if (curp > 1) {
        html += `<input type=\"button\" value=\"Назад\" onclick=\"switchPage(${curp - 1})\">`;
    }
    
    if (curp < mp) {
        html += `<input type=\"button\" value=\"Вперёд\" onclick=\"switchPage(${curp + 1})\">`;
    }
    
    $(".dataTable").html(html);
}

async function Add() {
    let plant = prompt("plant: ");
    if (plant === null) {
        return;
    }
    let care = prompt("how to take care: ");
    if (care === null) {
        return;
    }
    // all good
    const response = await fetch("http://localhost:3000/plant", {
        method: "POST",
        body: JSON.stringify({plant: plant, care: care}),
        headers: {
            "Content-Type": "application/json",
        }
    })
    
    let answer = "";
    
    switch(response.status) {
        case 201:
        answer = "Created sucessfully";
        break;
        case 400:
        answer = "The plant exists";
        break;
        default:
        answer = `IDK, code is ${response.status}`;
        break;
    }
    
    alert(answer);
    updateTable();
}

async function Delete(plant) {
    
    const response = await fetch(`http://localhost:3000/plant/${plant}`, {
        method: "DELETE"
    })
    
    let answer = "";
    
    switch(response.status) {
        case 201:
        answer = "Deleted sucessfully";
        break;
        default:
        answer = `IDK, code is ${response.status}`;
        break;
    }
    
    alert(answer);
    updateTable();
}

async function GetValue() {
    let plant = prompt("plant: ");
    if (plant === null) {
        return;
    }
    
    const response = await fetch(`http://localhost:3000/plant/${plant}`, {
        method: "GET"
    });
    
    let answer = ""
    
    switch(response.status) {
        case 200:
        break;
        case 400:
        answer = "The plant does not exist";
        break;
        default:
        answer = `IDK, code is ${response.status}`;
        break;
    }
    
    if (answer !== "") {
        alert (answer);
        return;
    }
    
    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");
    
    let json = "";
    while (true) {
        let { value: chunk, done: readerDone } = await reader.read();
        if (readerDone) {
            break;
        } else {
            if (chunk !== undefined) {
                json += decoder.decode(chunk, { stream: true });
            } else {
                alert("something went wrong");
                break;
            }
        }
    }
    
    let hash = JSON.parse(json);
    
    let ans = "";
    
    for (key in hash) {
        ans += `${key}: ${hash[key]}\n`;
    }
    
    alert(ans);
}

async function allval() {
    
    const response = await fetch(`http://localhost:3000/plant`, {
        method: "GET"
    });
    
    let answer = ""
    
    switch(response.status) {
        case 200:
        break;
        case 400:
        answer = "The plant does not exist";
        break;
        default:
        answer = `IDK, code is ${response.status}`;
        break;
    }
    
    if (answer !== "") {
        alert (answer);
        return;
    }
    
    const hash = response.json();
    
    return hash;
}

async function UpdateCare(plant) {
    let care = prompt("How to take care");
    if (care == undefined) {
        return;
    }
    
    
    const response = await fetch(`http://localhost:3000/plant/${plant}`, {
        method: "PATCH",
        body: JSON.stringify({
            care: care
        }),
        headers: {
            "Content-Type": "application/json",
        }
    });
    
    let answer = "";
    
    switch(response.status) {
        case 201:
        answer = "Edited sucessfully";
        break;
        case 400:
        answer = "The plant does not exist";
        break;
        default:
        answer = `IDK, code is ${response.status}`;
        break;
    }
    
    alert(answer);
    updateTable();
}

async function switchPage(page) {
    const toSort = $("#sort")[0].checked;
    const template = $("#find").val();
    const response = await fetch(`http://localhost:3000/plant/pagemode/${page}?sort=${toSort}&template=${template}`, {
        method: "GET"
    });
    
    let answer = ""
    
    switch(response.status) {
        case 200:
        break;
        case 400:
        answer = "The plant does not exist";
        break;
        default:
        answer = `IDK, code is ${response.status}`;
        break;
    }
    
    if (answer !== "") {
        alert (answer);
        return;
    }
    
    const result = await response.json();

    curp = result['pagenum'];
    mp = result['maxPages'];
    ShowTable(result['hash']);
}

function updateTable() {
    switchPage(curp);
}

updateTable();

function sortByName() {
    curp = 1;
    updateTable();
}

function find() {
    curp = 1;
    updateTable();
}