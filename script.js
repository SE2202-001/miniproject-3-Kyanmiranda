// Define the Job class
class Job {
    constructor(jobNo, title, link, posted, type, level, skill, detail) {
        this.jobNo = jobNo;
        this.title = title;
        this.link = link;
        this.posted = posted;
        this.type = type;
        this.level = level;
        this.skill = skill;
        this.detail = detail;
    }
}

// Global variables
let jobData = [];
let filteredJobs = [];

// DOM elements
const fileInput = document.getElementById("file-upload");
const uploadError = document.getElementById("upload-error");
const filterLevel = document.getElementById("filter-level");
const filterType = document.getElementById("filter-type");
const filterSkill = document.getElementById("filter-skill");
const filterJobsButton = document.getElementById("filter-jobs");
const sortBy = document.getElementById("sort-by");
const sortJobsButton = document.getElementById("sort-jobs");
const jobListing = document.getElementById("job-listing");
const noJobsMessage = document.getElementById("no-jobs");

// Load JSON file
fileInput.addEventListener("change", () => {
    const file = fileInput.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const data = JSON.parse(event.target.result);
                jobData = data.map(
                    (job) =>
                        new Job(
                            job["Job No"],
                            job["Title"],
                            job["Job Page Link"],
                            job["Posted"],
                            job["Type"],
                            job["Level"],
                            job["Skill"],
                            job["Detail"]
                        )
                );
                filteredJobs = [...jobData];
                populateFilters();
                renderJobs();
            } catch (error) {
                uploadError.textContent = "Invalid JSON format. Please upload a valid file.";
            }
        };
        reader.readAsText(file);
    }
});

// Populate filter options dynamically
function populateFilters() {
    const skills = new Set(jobData.map((job) => job.skill));
    filterSkill.innerHTML = '<option value="all">All</option>';
    skills.forEach((skill) => {
        const option = document.createElement("option");
        option.value = skill;
        option.textContent = skill;
        filterSkill.appendChild(option);
    });
}

// Render job listings
function renderJobs() {
    jobListing.innerHTML = '<h3>Job Listings</h3>';
    if (filteredJobs.length === 0) {
        noJobsMessage.style.display = "block";
        return;
    }
    noJobsMessage.style.display = "none";
    filteredJobs.forEach((job) => {
        const jobItem = document.createElement("div");
        jobItem.classList.add("job-item");
        jobItem.textContent = `${job.title} - ${job.type} (${job.level})`;
        jobItem.addEventListener("click", () => {
            alert(`
                Job No: ${job.jobNo}
                Title: ${job.title}
                Type: ${job.type}
                Level: ${job.level}
                Skill: ${job.skill}
                Detail: ${job.detail}
                Posted: ${job.posted}
                Link: ${job.link}
            `);
        });
        jobListing.appendChild(jobItem);
    });
}

// Filter jobs
filterJobsButton.addEventListener("click", () => {
    const level = filterLevel.value;
    const type = filterType.value;
    const skill = filterSkill.value;

    filteredJobs = jobData.filter((job) => {
        return (
            (level === "all" || job.level.toLowerCase() === level.toLowerCase()) &&
            (type === "all" || job.type.toLowerCase() === type.toLowerCase()) &&
            (skill === "all" || job.skill.toLowerCase() === skill.toLowerCase())
        );
    });
    renderJobs();
});

// Sort jobs
sortJobsButton.addEventListener("click", () => {
    const sortOption = sortBy.value;
    filteredJobs.sort((a, b) => {
        if (sortOption === "title-asc") {
            return a.title.localeCompare(b.title);
        } else if (sortOption === "title-desc") {
            return b.title.localeCompare(a.title);
        } else if (sortOption === "posted-asc") {
            return new Date(a.posted) - new Date(b.posted);
        } else if (sortOption === "posted-desc") {
            return new Date(b.posted) - new Date(a.posted);
        }
    });
    renderJobs();
});
