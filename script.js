let dropBox = document.getElementById('drop-box');
let inputCsv = document.getElementById('input-csv');
let submitMusicNameList = {};
let submitMusicGameNameList = {};

// ファイルを選択するときの処理
inputCsv.addEventListener('change', function (e) {
    let files = e.target.files;
    handleCSVFile(files);
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

// ドロップ時の処理
dropBox.addEventListener('drop', function (e) {
    e.preventDefault();
    dropBox.classList.remove('dragover');

    // ドロップしたファイルの取得
    let files = e.dataTransfer.files;
    handleCSVFile(files);
});

// CSVファイルを受け取る
function handleCSVFile(files) {
    let result = document.getElementById('result');
    let reader = new FileReader();
    if (typeof files[0] !== 'undefined') {
        //ファイルが正常に受け取れた際の処理
        reader.onload = () => {
            let output = createResult(reader.result);
            let musicGameList = Object.values(submitMusicGameNameList);
            alert("募集した機種が以下の"+ musicGameList.length + "機種であることを確認してください。\n\n・" +musicGameList.join('\n・') + "\n\n機種が少ない場合は、募集文の機種名が「」で囲まれているか確認してください。");
            result.append(output);
        };
        reader.readAsText(files[0]);
    } else {
        //ファイルが受け取れなかった際の処理
        alert('Can not load file.');
    }
}

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
        let musicGameName = submitMusicGameNameList[musicId];
        divDialog.append('【' + musicGameName + '】\n');
        Object.keys(submitMusicNameList).map(musicPostId => {
            if (musicPostId.includes(musicId)) {
                divDialog.append(submitMusicNameList[musicPostId] + '\n');
            }
        })
        divDialog.append('\n');
    })
}

// 配列をシャッフルする
function shuffleWithinArray(postInfoArray) {
    for (let i = postInfoArray.length; 1 < i; i--) {
        let k = Math.floor(Math.random() * i);
        [postInfoArray[k], postInfoArray[i - 1]] = [postInfoArray[i - 1], postInfoArray[k]];
    }

    return postInfoArray;
}

// ダブルクォーテーションに対応したcsvファイル1行分割関数
// 参考: https://qiita.com/hatorijobs/items/dd0c730e6faba0c84203
function csvSplit(line) {

    var c = "";
    var s = new String();
    var data = new Array();
    var inQuoteFlg = false;
    var QuoteRemoveFlg = false;

    for (var i = 0; i < line.length; i++) {

        c = line.charAt(i);
        if (c == "," && !inQuoteFlg) {
            data.push(s.toString());
            s = "";
        }
        else if (c == "," && inQuoteFlg) {
            s = s + c;
        }
        // 入りの"
        else if (c == '"' && !inQuoteFlg) {
            inQuoteFlg = true;
        }
        else if (c == '"' && inQuoteFlg){
            // 抜けの"
            if( [",","\n"].includes(line.charAt(i+1)) ) {
                inQuoteFlg = false;
            }
            // 本来の"はエクスポート時""にエスケープされているので、それを"に戻す
            else if( QuoteRemoveFlg ) {
                QuoteRemoveFlg = false;
            }
            else {
                s = s + c;
                if( !QuoteRemoveFlg ) QuoteRemoveFlg = true;
            }
        }
        else {
            s = s + c;
        }

    }

    if( s.length>0 ) data.push(s.toString());
    return data;

}


// csvファイルを読み込んだらtableを作成する
function createResult(result) {
    // 全機種選択曲表示のボタンを表示しイベントを追加
    let submitMusicButton = document.getElementById('submit-music');
    submitMusicButton.classList.remove('button-none');
    submitMusicButton.addEventListener('click', popupMusicList);

    // csvの整形
    let postInfoArray = result.split("\n");
    // 各投稿者の投稿情報のリスト[timestamp, CN, musicName...]
    let tableHeadList = csvSplit(postInfoArray[0]);
    postInfoArray.shift();
    let response = document.createElement('div');

    // 機種ごとに繰り返す
    for (let i = 2; i < tableHeadList.length; i++) {
        // 全体
        var element = document.createElement('div');
        element.classList.add('table-margin');
        var tbl = document.createElement('table');
        tbl.classList.add('table', 'table-center', 'music-table');
        var tblHead = document.createElement('thead');
        var rowHead = document.createElement("tr");
        var cellHeadRowNum = document.createElement("td");

        // 機種名の抽出・登録
        var musicRecruitingText = document.createTextNode(tableHeadList[i]);
        var musicGameName = musicRecruitingText.textContent.match(/[\u300c\uff62].*[\u300d\uff63]/)[0].slice(1,-1);
        submitMusicGameNameList['music' + i] = musicGameName;

        // 見出し
        // 曲の行番号用
        cellHeadRowNum.appendChild(document.createTextNode("No."));
        var cellHeadMusicName = document.createElement("td");
        cellHeadMusicName.appendChild(document.createTextNode("曲名"));
        var cellHeadPostName = document.createElement("td");
        cellHeadPostName.appendChild(document.createTextNode("投稿者"));
        var cellHeadButton = document.createElement("td");
        rowHead.appendChild(cellHeadRowNum);
        rowHead.appendChild(cellHeadMusicName);
        rowHead.appendChild(cellHeadPostName);
        rowHead.appendChild(cellHeadButton);
        tblHead.appendChild(rowHead);

        // 応募された項目
        var tblBody = document.createElement('tbody');
        // シャッフルする
        postInfoArray = shuffleWithinArray(postInfoArray);
        // 人ごとに繰り返す
        for (let j = 0; j < postInfoArray.length; j++) {
            var rowBody = document.createElement('tr');
            var postInfo = csvSplit(postInfoArray[j]);
            var id = 'music' + i + 'post' + j;
            // 当日エラー起きたときに、その原因を見れるようにするために残す
            console.log({
                'id': id,
                'postInfo': postInfo[i],
                'rowBody': rowBody,
            });

            // 投稿していない場合、スキップ
            if (!postInfo[i]) {
                continue;
            }

            // 全ての改行コードを削除
            postInfo[i] = postInfo[i].replace(/\r?\n/g, '');
            // 両端の空白を削除
            postInfo[i] = postInfo[i].trim();

            // 改行コードや空白を除いた場合でも空白の場合、スキップ
            if (!postInfo[i]) {
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

        // 整形
        tbl.appendChild(tblHead);
        tbl.appendChild(tblBody);
        let subtitle = document.createElement('h2');
        subtitle.className = 'subtitle';
        subtitle.innerHTML = musicGameName;
        element.appendChild(subtitle);
        element.appendChild(tbl);
        response.appendChild(element);
    }

    return response;
}
