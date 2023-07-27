

const commentFormHandler = async (event) => {
  event.preventDefault();

  //query selector
  const post_id = document.querySelector("#post-id").value.trim();
  const content = document.querySelector("#comment-body").value.trim();
  
  if(content) {
    console.log(post_id)
    console.log(content)
  }

  if(content) {
    const response = await fetch("/api/comment", {
      method: "POST",
      body: JSON.stringify({
        post_id,
        content
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      document.location.reload();
    } else {
      alert(response.statusText);
    }
  }
};
//query selector
document
  .querySelector(".new-comment-form")
  .addEventListener("submit", commentFormHandler);
