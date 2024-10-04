const loadCategories = () => {
    // fetch the data
    fetch('https://openapi.programming-hero.com/api/phero-tube/categories')
        .then((res) => res.json())
        .then((data) => displayCategories(data.categories))
        .catch((error) => console.log(error))
}

function getTimeString(time) {
    const hour = parseInt(time / 3600);
    let remainingSecond = parseInt(time % 3600);
    const minute = parseInt(remainingSecond / 60);
    remainingSecond = remainingSecond % 60;
    return `${hour} Hour ${minute} Minute ${remainingSecond} Second ago`;
}

const removeActiveClass = () => {
    const buttons = document.getElementsByClassName('btn-category');
    for(let btn of buttons){
        btn.classList.remove('active');
    }
}

const loadVideos = (searchText = '') => {
    // fetch the data
    fetch(`https://openapi.programming-hero.com/api/phero-tube/videos?title=${searchText}`)
        .then((res) => res.json())
        .then((data) => displayVideos(data.videos))
        .catch((error) => console.log(error))
}

const loadCategoryVideos = (id) => {
    // alert(id);
    fetch(`https://openapi.programming-hero.com/api/phero-tube/category/${id}`)
        .then((res) => res.json())
        .then((data) => {
            removeActiveClass();
            const activeBtn = document.getElementById(`btn-${id}`);
            activeBtn.classList.add('active')
            displayVideos(data.category)
        })
        .catch((error) => console.log(error))
}

const loadDetails = async (videoId) => {
    const uri = `https://openapi.programming-hero.com/api/phero-tube/video/${videoId}`;
    const res = await fetch(uri);
    const data = await res.json();
    displayDetails(data.video);
};

const displayDetails = (video) => {
    console.log(video);
    const detailsContainer = document.getElementById('modal-content');

    detailsContainer.innerHTML = `
        <img class = 'w-full mb-4' src = ${video.thumbnail}/>
        <p class = 'text-gray-400'>${video.description}</p>
    `

    document.getElementById('showModalData').click();
}


const obj =
{
    "category_id": "1001",
    "video_id": "aaab",
    "thumbnail": "https://i.ibb.co/QPNzYVy/moonlight.jpg",
    "title": "Midnight Serenade",
    "authors": [
        {
            "profile_picture": "https://i.ibb.co/fDbPv7h/Noha.jpg",
            "profile_name": "Noah Walker",
            "verified": false
        }
    ],
    "others": {
        "views": "543K",
        "posted_date": ""
    },
    "description": "'Midnight Serenade' by Noah Walker is a soulful journey into the depths of the night, capturing the mystique and allure of a moonlit evening. With 543K views, this song brings together tender melodies and evocative lyrics, making it a favorite among listeners seeking a contemplative yet uplifting experience. Immerse yourself in this musical masterpiece and feel the calm embrace of the night."
}



const displayVideos = (videos) => {
    const videoContainer = document.getElementById('videos');
    videoContainer.innerHTML = '';

    if (videos.length === 0) {
        videoContainer.classList.remove('grid');
        videoContainer.innerHTML = `
            <div class = 'min-h-[500px] flex flex-col gap-4 justify-center items-center'>
                <img src = './images/Icon.png'/>
                <p class = 'text-3xl font-bold text-center'>Oops!!Sorry, There is no content here</p>
            </div>
        `;
        return;
    } else {
        videoContainer.classList.add('grid');
    }

    videos.forEach((video) => {
        console.log(video);
        const card = document.createElement('div');
        card.classList = 'card card-compact';
        card.innerHTML = `
            <figure class = 'h-[250px] relative'>
                <img
                src=${video.thumbnail}
                class = 'h-full w-full object-cover'
                alt="Shoes" />
                <span>
                    ${video.others.posted_date?.length === 0 ? '' : `
                <span class = 'absolute right-1 bottom-1 bg-slate-900 text-white py-0 px-3 text-xs'>${getTimeString(video.others.posted_date)}</span>`}
                </span>
            </figure>
            <div class="px-0 py-2 flex gap-2">
                <div>
                    <img class = 'w-10 h-10 rounded-full object-cover' src=${video.authors[0].profile_picture}/>
                </div>
                <div class = 'relative'>
                    <h1 class = 'font-bold'>${video.title}</h1>
                    <div class = 'flex items-center gap-1'>
                        <p class = 'text-gray-400 text-[14px]'>${video.authors[0].profile_name}</p>

                        ${video.authors[0].verified === true ? `
                        <img class = 'w-4 h-4' src = 'https://img.icons8.com/?size=48&id=D9RtvkuOe31p&format=png'/>` : ''}

                    </div>
                    <p class = 'text-[13px] text-gray-400 mt-2'>${video.others.views} Views</p>
                </div>
                <div>
                    <button onclick = "loadDetails('${video.video_id}')" class = 'btn-error btn btn-sm text-white absolute right-2 bottom-2'>Details</button>
                </div>
            </.div>
            </div>
        `
        videoContainer.append(card);
    })
}


const displayCategories = (categories) => {
    const categoriesContainer = document.getElementById('categories');
    categories.forEach((item) => {
        console.log(item);
        const btnContainer = document.createElement('div');
        btnContainer.classList = 'w-auto'
        btnContainer.innerHTML = `
            <button id = 'btn-${item.category_id}' onclick = 'loadCategoryVideos(${item.category_id})' class = 'btn btn-category'>
                ${item.category}
            </button>  
        `
        categoriesContainer.append(btnContainer);
    });
}


document.getElementById('search-input').addEventListener('keyup', (e) => {
    loadVideos(e.target.value);
})
loadCategories();
loadVideos();