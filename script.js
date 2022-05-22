let dropBox = document.getElementById('drop-box');
let inputCsv = document.getElementById('input-csv');
let submitMusicNameList = {};
let submitMusicGameNameList = {};

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
        };
        reader.readAsText(files[0]);
    } else {
        // ファイルが受け取れなかった際の処理
        alert('Can not load file.');
    }
}, false);

// ドラッグオーバー時の処理
dropBox.addEventListener('dragover', function (e) {
    e.preventDefault();
    dropBox.classList.add('dragover');
});

// ドラッグアウト時の処理
dropBox.addEventListener('dragleave', function (e) {
    e.preventDefault();
    dropBox.classList.remove('dragover');
});


dropBox.addEventListener('drop', function (e) {
    e.preventDefault();
    dropBox.classList.remove('dragover');

    // ドロップしたファイルの取得
    let files = e.dataTransfer.files;
    let result = document.getElementById('result');
    let reader = new FileReader();
    if (typeof files[0] !== 'undefined') {
        //ファイルが正常に受け取れた際の処理
        reader.onload = () => {
            let output = createResult(reader.result);
            result.append(output);
        };
        reader.readAsText(files[0]);
    } else {
        //ファイルが受け取れなかった際の処理
        alert('Can not load file.');
    }
});

// クリックすると曲名と投稿者が表示される処理
function clickToShowMusic(e) {
    var buttonElement = document.getElementById(e.target.id);
    buttonElement.textContent = '投稿者を見る';
    buttonElement.onclick = clickToShowName
    var targetTableRow = buttonElement.parentElement.parentElement;
    targetTableRow.childNodes[1].classList.remove('text-blur');
}

// クリックすると曲名と投稿者が表示される処理
function clickToShowName(e) {
    var buttonElement = document.getElementById(e.target.id);
    buttonElement.textContent = 'この曲に決定する';
    buttonElement.onclick = clickToSubmit;
    var targetTableRow = buttonElement.parentElement.parentElement;
    targetTableRow.childNodes[2].classList.remove('text-blur');
}

// スコアタ曲を決定する
function clickToSubmit(e) {
    var buttonElement = document.getElementById(e.target.id);
    var result = confirm('本当にこの曲にしますか？');
    if (result) {
        var targetTableRow = buttonElement.parentElement.parentElement;
        targetTableRow.classList.add('music-submit');
        buttonElement.onclick = '';
        var targetMusic = targetTableRow.children;
        console.log(targetMusic);
        submitMusicNameList[buttonElement.id] = targetMusic[1].childNodes[0].textContent;
        buttonElement.textContent = '確定しました';
    }
}

// 選択した曲リストがポップアップされる
function popupMusicList() {
    let divDialog = document.getElementById('result-modal');
    divDialog.textContent = '';
    Object.keys(submitMusicGameNameList).map(musicId => {
        let str = submitMusicGameNameList[musicId];
        let startIndex = str.search(/「/);
        let endIndex = str.search(/」/);
        let musicGameName = str.substring(startIndex + 1, endIndex);
        divDialog.append(musicGameName + '\n');
        Object.keys(submitMusicNameList).map(musicPostId => {
            if (musicPostId.includes(musicId)) {
                divDialog.append(submitMusicNameList[musicPostId] + '\n');
            }
        })
        divDialog.append('\n');
    })
}

// csvファイルを読み込んだらtableを作成する
function createResult(result) {
    let submitMusicButton = document.getElementById('submit-music');
    submitMusicButton.classList.remove('button-none');
    submitMusicButton.addEventListener('click', popupMusicList);
    let postInfoArray = result.split("\n");
    // 各投稿者の投稿情報のリスト[timestamp, CN, musicName...]
    let tableHeadList = postInfoArray[0].split(',');
    let response = document.createElement('div');
    for (let i = 2; i < tableHeadList.length; i++) {
        var element = document.createElement('div');
        element.classList.add('table-margin');
        var tbl = document.createElement('table');
        tbl.classList.add('table', 'table-center', 'music-table');
        var tblHead = document.createElement('thead');
        var rowHead = document.createElement("tr");
        var cellHeadRowNum = document.createElement("td");
        // 曲の行番号用
        cellHeadRowNum.appendChild(document.createTextNode("No."));
        var cellHeadMusicName = document.createElement("td");
        var musicText = document.createTextNode(tableHeadList[i]);
        submitMusicGameNameList['music' + i] = musicText.textContent;
        cellHeadMusicName.appendChild(document.createTextNode("曲名"));
        var cellHeadPostName = document.createElement("td");
        cellHeadPostName.appendChild(document.createTextNode("投稿者"));
        var cellHeadButton = document.createElement("td");
        rowHead.appendChild(cellHeadRowNum);
        rowHead.appendChild(cellHeadMusicName);
        rowHead.appendChild(cellHeadPostName);
        rowHead.appendChild(cellHeadButton);
        tblHead.appendChild(rowHead);

        var tblBody = document.createElement('tbody');
        for (let j = 1; j < postInfoArray.length; j++) {
            var rowBody = document.createElement('tr');
            var postInfo = postInfoArray[j].split(',');
            var id = 'music' + i + 'post' + j;
            // 投稿していない場合、スキップ
            console.log(id);
            console.log(postInfo);
            if (!postInfo[i]) {
                continue;
            }

            if (!postInfo[i].trim()) {
                continue;
            }

            rowBody.classList.add('body-row');
            var cellBodyRowNum = document.createElement('td');
            cellBodyRowNum.classList.add('row-num');
            var cellBodyMusicName = document.createElement('td');
            cellBodyMusicName.appendChild(document.createTextNode(postInfo[i]));
            cellBodyMusicName.classList.add('text-blur');
            var cellBodyPostName = document.createElement('td');
            var postName = postInfo[1];
            cellBodyPostName.appendChild(document.createTextNode(postName));
            cellBodyPostName.className = 'text-blur';
            var cellBodyButton = document.createElement('td');
            var showNameButton = document.createElement('button');
            showNameButton.textContent = 'この曲を見る';
            showNameButton.className = 'button';
            showNameButton.onclick = clickToShowMusic;
            showNameButton.id = id;
            cellBodyButton.appendChild(showNameButton);
            rowBody.appendChild(cellBodyRowNum);
            rowBody.appendChild(cellBodyMusicName);
            rowBody.appendChild(cellBodyPostName);
            rowBody.appendChild(cellBodyButton);
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
