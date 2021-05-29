let dropBox = document.getElementById('drop-box');
let inputCsv = document.getElementById('input-csv');

// ファイルを選択する５ときの処理
inputCsv.addEventListener('change', function (e) {
    let files = e.target.files;
    let result = document.getElementById('result');
    let reader = new FileReader();
    if (typeof files[0] !== 'undefined') {
        // ファイルが正常に受け取れた際の処理
        reader.onload = () => {
            let output = createResult(reader.result);
            result.append(output);
            console.log(output);
        };
        reader.readAsText(files[0]);

    } else {
        // ファイルが受け取れなかった際の処理
    }
}, false);

function createResult(result) {

    let postInfoArray = result.split("\n");
    // 各投稿者の投稿情報のリスト[timestamp, CN, musicName...]
    let tableHeadList = postInfoArray[0].split(',');
    let response = document.createElement('div');
    for (let i = 2; i < tableHeadList.length; i++) {
        var element = document.createElement('div');
        element.className = 'table-margin';
        var tbl = document.createElement('table');
        tbl.className = 'table table-center';
        var tblHead = document.createElement('thead');
        var rowHead = document.createElement("tr");
        var cellHeadMusicName = document.createElement("td");
        var musicText = document.createTextNode(tableHeadList[i]);
        cellHeadMusicName.appendChild(document.createTextNode("曲名"));
        var cellHeadPostName = document.createElement("td");
        cellHeadPostName.appendChild(document.createTextNode("投稿者"));
        rowHead.appendChild(cellHeadMusicName);
        rowHead.appendChild(cellHeadPostName);
        tblHead.appendChild(rowHead);

        var tblBody = document.createElement('tbody');
        for (let j = 1; j < postInfoArray.length; j++) {
            var rowBody = document.createElement('tr');
            var postInfo = postInfoArray[j].split(',');
            // 投稿していない場合、スキップ
            if (!postInfo[i].trim()) {
                continue;
            }

            var cellBodyMusicName = document.createElement('td');
            cellBodyMusicName.appendChild(document.createTextNode(postInfo[i]));
            rowBody.appendChild(cellBodyMusicName);
            var cellBodyPostName = document.createElement('td');
            var postName = postInfo[1];
            cellBodyPostName.appendChild(document.createTextNode(postName));
            rowBody.appendChild(cellBodyPostName);
            tblBody.appendChild(rowBody);
        }
        tbl.appendChild(tblHead);
        tbl.appendChild(tblBody);
        let subtitle = document.createElement('h2');
        subtitle.className = 'subtitle';
        subtitle.appendChild(musicText);
        element.appendChild(subtitle);
        element.appendChild(tbl);
        response.appendChild(element);
    }

    return response;
}
