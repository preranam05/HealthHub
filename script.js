document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('user-info-form').addEventListener('submit', async function(e) {
        e.preventDefault();

        // Show a loading message when generating the plan
        const planContainer = document.getElementById('generatedPlan');
        const planResultSection = document.getElementById('planResult');

        // Remove 'd-none' class to show the plan result section
        planResultSection.classList.remove('d-none');

        planContainer.innerHTML = `<p class='loading-message'>Please be patient while we generate your personalized plan...</p>`;

        // Scroll to the plan result section
        planResultSection.scrollIntoView({ behavior: 'smooth' });

        // Collect user input
        const name = document.getElementById('name').value;
        const age = document.getElementById('age').value;
        const weight = document.getElementById('weight').value;
        const height = document.getElementById('height').value;
        const gender = document.getElementById('gender').value;
        const preferences = document.getElementById('preferences').value;
        const allergies = document.getElementById('allergies').value;
        const activityLevel = document.getElementById('activity-level').value;
        const goal = document.getElementById('goal').value;

        // Create an object with user input
        const userData = {
            name,
            age,
            weight,
            height,
            gender,
            preferences,
            allergies,
            activity_level: activityLevel,
            goal
        };

        try {
            // Send the user data to the backend using a POST request
            const response = await fetch('http://127.0.0.1:5000/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });

            // Parse the response from the backend
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const result = await response.json();

            // Format and display the generated plan
            planContainer.innerHTML = formatPlan(result.plan);
        } catch (error) {
            console.error('Error:', error);
            planContainer.innerHTML = `<p>Error generating the plan: ${error.message}</p>`;
        }
    });
});

// Function to format the plan data into HTML structure
function formatPlan(planText) {
    let formattedPlan = `
        <h3 class='centered mb-4'>Your AI-Generated Diet and Workout Plan</h3>
        <div class="container">
            <div class="row">
                <div class="col">
    `;

    // Replace markdown-like syntax with HTML tags
    planText = planText.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>'); // Bold text
    planText = planText.replace(/\*(.*?)\*/g, '<em>$1</em>'); // Italic text
    planText = planText.replace(/^# (.*)$/gm, '<h4>$1</h4>'); // H4 headers
    planText = planText.replace(/^## (.*)$/gm, '<h5>$1</h5>'); // H5 headers
    planText = planText.replace(/^### (.*)$/gm, '<h6>$1</h6>'); // H6 headers

    // Convert bullet points and numbered lists
    planText = planText.replace(/^- (.*)$/gm, '<li>$1</li>'); // Bulleted list items
    planText = planText.replace(/^(\d+)\. (.*)$/gm, '<li>$2</li>'); // Numbered list items

    // Wrap lists with <ul> or <ol>
    planText = planText.replace(/(<li>.*?<\/li>)/gs, function(match) {
        // Check if it's a numbered list or bullet list
        if (match.match(/<li>\d+/)) {
            return `<ol>${match}</ol>`;
        } else {
            return `<ul>${match}</ul>`;
        }
    });

    // Remove '*/' if any
    planText = planText.replace(/\*\//g, '');

    // Break the text into lines for further processing
    const lines = planText.split('\n').filter(line => line.trim() !== '');

    // Build the formatted plan using Bootstrap components
    lines.forEach(line => {
        if (line.startsWith('<h4>')) {
            formattedPlan += `<h4 class="mt-4">${line.substring(4, line.length - 5)}</h4>`;
        } else if (line.startsWith('<h5>')) {
            formattedPlan += `<h5 class="mt-3">${line.substring(4, line.length - 5)}</h5>`;
        } else if (line.startsWith('<h6>')) {
            formattedPlan += `<h6 class="mt-2">${line.substring(4, line.length - 5)}</h6>`;
        } else if (line.startsWith('<ul>') || line.startsWith('<ol>')) {
            formattedPlan += `${line}`;
        } else {
            formattedPlan += `<p>${line}</p>`;
        }
    });

    formattedPlan += `
                </div>
            </div>
            <p class='mt-4'>If you have any queries or require further assistance, feel free to contact us!</p>
        </div>
    `;

    return formattedPlan;
}

// Initialize Bootstrap tooltips
document.addEventListener('DOMContentLoaded', function () {
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
});


// Back to Top Button
const backToTopButton = document.querySelector('.back-to-top');

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        backToTopButton.classList.add('active');
        backToTopButton.style.display = 'flex';
    } else {
        backToTopButton.classList.remove('active');
        backToTopButton.style.display = 'none';
    }
});

// Smooth Scroll for Back to Top Button
backToTopButton.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({top: 0, behavior: 'smooth'});
});
