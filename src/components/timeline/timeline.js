export default class Timeline {
    constructor(timelineTag) {
        this.timeLineContainer = document.querySelector(timelineTag);
        this.timeLineUl = this.timeLineContainer.querySelector('.timeline');
        this.keybord = this.timeLineContainer.querySelector('.keyboard');


        this.keybord.addEventListener('keyup', (e) => {
            this.key = e.key;
            if (this.key === 'Enter') {
                this.validate = this.validateKeybord(this.keybord.value.trim());
                if (this.validate) {
                    this.date = new Date().toLocaleString('ru', { numeric:true });
                    this.createPost(this.keybord.value, this.date, 'test cord');
                    this.keybord.value = '';
                }
                
            }
        });
    }

    validateKeybord(text) {
        this.text = text;

        if (isNaN(this.text) && this.text) {
            return true;
        }
        return false;
    }

    createPost(text, date, cord) {
        const li = document.createElement('li');
        const post = document.createElement('div');
        const postText = document.createElement('div');
        const postDate = document.createElement('div');
        const cords = document.createElement('div');
        const cordsIcon = document.createElement('span');
        const cordinate = document.createElement('span');
        cordinate.textContent = cord;
        postText.textContent = text;
        postDate.textContent = date;
        cordsIcon.classList.add('cords-icon');
        cords.classList.add('cords');
        postDate.classList.add('post-date')
        postText.classList.add('post-text');
        post.classList.add('post');
        cords.appendChild(cordinate);
        cords.appendChild(cordsIcon);
        post.appendChild(postText);
        post.appendChild(postDate);
        post.appendChild(cords);
        li.appendChild(post);
        this.timeLineUl.appendChild(li);
    }
}