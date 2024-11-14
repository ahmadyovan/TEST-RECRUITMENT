document.addEventListener("DOMContentLoaded", loadFeedback);

let feedbackData = []; 
let isSliding = false;

async function loadFeedback() {
    try {
        const response = await fetch('server/fetch_feedback.php');
        const result = await response.json();
        console.log(result); 

        const feedbackContainer = document.getElementById('feedbackContainer');
        const noFeedbackMessage = document.getElementById('noFeedbackMessage'); 

        // Mengecek apakah feedback kosong
        if (result.status === "success" && result.data.length > 0) {
            feedbackData = result.data; 
            noFeedbackMessage.style.display = 'none'; 
            initializeSlider();
        } else {
            feedbackData = []; 
            noFeedbackMessage.style.display = 'block'; 
            feedbackContainer.innerHTML = ''; 
        }
    } catch (error) {
        console.error("Error loading feedback:", error.message);
    }
}

document.addEventListener("DOMContentLoaded", function() {
    // Pilih gambar acak dan atur src-nya
    const randomImage = document.getElementById('randomImage');
    const randomImageNumber = Math.floor(Math.random() * 1000); 
    randomImage.src = `https://picsum.photos/100?random=${randomImageNumber}`;
});

function createSlideElement(feedback) {
    const slide = document.createElement('div');
    slide.className = "slide";
    slide.innerHTML = `
        <img src="https://picsum.photos/80?random=${Math.floor(Math.random() * 100)}" alt="User Image">
        <div class="slide-content">
            <h3>${feedback.name}</h3>
            <p class="message">${feedback.message}</p>
        </div>
    `;
    return slide;
}

function initializeSlider() {
    const container = document.getElementById('feedbackContainer');
    container.innerHTML = '';

    console.log(feedbackData.length);
    
    
    const slidesToShow = 3; 
    const totalSlides = feedbackData.length;
    
    if (totalSlides < slidesToShow) {
        feedbackData.forEach(feedback => {
            container.appendChild(createSlideElement(feedback));
        });
        return;
    }

    let currentIndex = 0;

    for (let i = 0; i < slidesToShow + 1; i++) {
        const slide = createSlideElement(feedbackData[i % totalSlides]);
        container.appendChild(slide);
    }

    async function slideNext() {
        if (isSliding || totalSlides < slidesToShow) return;
        isSliding = true;

        const slideWidth = container.firstElementChild.offsetWidth + 32;
        
        container.style.transform = `translateX(-${slideWidth}px)`;
        
        await new Promise(resolve => setTimeout(resolve, 500));

        container.removeChild(container.firstElementChild);
        
        container.style.transition = 'none';
        container.style.transform = 'translateX(0)';
        
        const nextIndex = (currentIndex + slidesToShow) % totalSlides;
        const newSlide = createSlideElement(feedbackData[nextIndex]);
        container.appendChild(newSlide);
        
        container.offsetHeight;
        
        container.style.transition = 'transform 0.5s ease-in-out';
        
        currentIndex = (currentIndex + 1) % totalSlides;
        
        isSliding = false;
    }

    const sliderInterval = setInterval(slideNext, 3000);
    
    container.style.transition = 'transform 0.5s ease-in-out';

    return () => clearInterval(sliderInterval);
}

const textarea = document.getElementById('message');
textarea.addEventListener('input', function () {
    this.style.height = 'auto';
    this.style.height = `${this.scrollHeight}px`;
});

document.getElementById('feedbackForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;

    if (name.trim() === "" || email.trim() === "" || message.trim().length < 10) {
        alert("Please fill in all fields correctly.");
        return;
    }

    try {
        const response = await fetch('server/save_feedback.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, message })
        });
        const result = await response.json();
        if (result.status === "success") {
            alert("Feedback berhasil dikirim!");
            // Reset form
            this.reset();
            textarea.style.height = 'auto';
        
            setTimeout(loadFeedback, 500);
        } else {
            alert("Gagal mengirim feedback: " + result.message);
        }
    } catch (error) {
        alert("Error: " + error.message);
    }
});