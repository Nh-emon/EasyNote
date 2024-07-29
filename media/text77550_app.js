const get = element => document.querySelector(element);

const checkEl = element => {
    element.addEventListener('click', () =>
        alert(`element is clicked its where text = ${element.innerText}`)
    );
};

const removePreviousData = () => {
    get('#synonyms').innerText = '';
    get('#content-example').innerText = '';
};

const dictonaryInput = get('#dictonaryInput');
const synonymList = get('#synonyms');
let wordAudio;

const insertData = (mainWord, part_of_speech, pheontic, wordMeaning, wordExample, synonyms) => {
    removePreviousData();
    get('#main-word').innerText = mainWord;
    part_of_speech && pheontic && (get('#word-extra').innerText = `${part_of_speech}/${pheontic}`);
    get('#content-meaning').innerText = wordMeaning || '';
    get('#content-example').innerText = wordExample || 'not found';

    const newSynonymList = synonyms ? synonyms.slice(0, 5) : [];
    const synSpanTemplate = eachSynonym => {
        const newSynonym = document.createElement('span');
        newSynonym.classList.add('synonym-result');
        newSynonym.innerText = eachSynonym;
        synonymList.appendChild(newSynonym);
        newSynonym.addEventListener('click', () => fetchWord(eachSynonym));
    };

    newSynonymList.length <= 0
        ? (get('#synonyms').innerText = 'not found!')
        : (synonymList.querySelectorAll('span').forEach(span => span.remove()),
          newSynonymList.forEach(synSpanTemplate));

    get('#mainBody').classList.add('active');
    get('#gifLoad').classList.remove('active');
};

const fetchWord = word => {
    get('#gifLoad').classList.add('active');
    const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;

    fetch(url)
        .then(res => {
            if (!res.ok) {
                createToast('error', `response failed status:${res.status}`);
                throw new Error(`Network response was not ok: ${res.status}`);
            }
            return res.json();
        })
        .then(result => {
            const wordResult = result[0];
            const part_of_speech = wordResult.meanings[0].partOfSpeech;
            const pheontic = wordResult.phonetics[0].text;
            const wordMeaning = wordResult.meanings[0].definitions[0].definition;
            const wordExample = wordResult.meanings[0].definitions[0].example;
            const synonyms = wordResult.meanings[0].synonyms;
            const mainWord = wordResult.word;
            wordAudio = new Audio(wordResult.phonetics[0].audio);
            insertData(mainWord, part_of_speech, pheontic, wordMeaning, wordExample, synonyms);
        })
        .catch(error => {
            createToast('error', error);
        });
};

dictonaryInput.addEventListener('keyup', e => {
    if (e.key === 'Enter' && e.target.value.length > 1) {
        get('#instruction-message').style.display = 'none';
        fetchWord(e.target.value);
        dictonaryInput.value = '';
    }
});

get('#deleteInput').addEventListener('click', () => {
    dictonaryInput.value = '';
    dictonaryInput.focus();
});

get('#wordAudio').addEventListener('click', () => {
    wordAudio ? wordAudio.play() : createToast('error', 'not found');
});
