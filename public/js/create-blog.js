//function called when user clicks button to add new blog. starts process
async function createBlogHandler(event) {
    event.preventDefault();

    document.location.replace('/dashboard/new')
}


document.querySelector('#create-new-blog').addEventListener('click', createBlogHandler);