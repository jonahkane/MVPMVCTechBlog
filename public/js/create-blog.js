async function createBlogHandler(event) {
    event.preventDefault();

    document.location.replace('/dashboard/new')
}


document.querySelector('#create-new-blog').addEventListener('click', createBlogHandler);