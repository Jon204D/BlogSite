using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Server_Escape.Models;
using Server_Escape.Services;

namespace Server_Escape.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PostController : ControllerBase
    {
        //Allow custom return statement
        public readonly IPostServices _postServices;
        public PostController(IPostServices postServices)
        {
            _postServices = postServices;
        }

        /*
         * Post method instead of Get so that the data is not accessible on the server side.
         */
        [HttpPost]
        [Route("insert-post-record")]
        public IActionResult InsertPostRecord(Post model)
        {
            string uploadMsg = _postServices.InsertPostRecord(model);

            if (uploadMsg == "Uploaded Successfully")
            {
                return Ok(uploadMsg);
            }
            else
            {
                return BadRequest(uploadMsg);
            }
        }

        /*
         * Post method instead of Get so that the data is not accessible on the server side.
         */
        [HttpPost]
        [Route("get-post-record")]
        public IEnumerable<Post> GetAllPostRecord()
        {
            List<Post> posts = new List<Post>();
            posts = _postServices.GetAllPostRecord();
            return posts;
        }

        /*
         * Post method instead of Get so that the data is not accessible on the server side.
         */
        [HttpPost]
        [Route("get-a-post-record")]
        public IEnumerable<Post> GetAPostRecord(Post model)
        {
            List<Post> posts = new List<Post>();
            posts = _postServices.GetAPostRecord(model.PostsID);
            return posts;
        }

        /*
         * Post method instead of Get so that the data is not accessible on the server side.
         */
        [HttpPost]
        [Route("get-artist-post-record")]
        public IEnumerable<Post> GetArtistPostRecord(Post model)
        {
            List<Post> posts = new List<Post>();
            posts = _postServices.GetArtistPostRecord(model.PostsAuthor);
            return posts;
        }


        /*
         * Post method instead of Get so that the data is not accessible on the server side.
         */
        [HttpPost]
        [Route("update-a-post-record")]
        public IActionResult UpdateAPostRecord(Post model)
        {
            string updateMsg = _postServices.UpdateAPostRecord(model);

            if (updateMsg == "Updated Successfully")
            {
                return Ok(updateMsg);
            }
            else
            {
                return BadRequest(updateMsg);
            }
        }

        [HttpPost]
        [Route("delete-a-post-record")]
        public IActionResult DeleteAPostRecord(Post model)
        {
            string deleteMsg = _postServices.DeleteAPostRecord(model.PostsID);

            if (deleteMsg == "Delete Successful")
            {
                return Ok(deleteMsg);
            }
            else
            {
                return BadRequest(deleteMsg);
            }
        }

        [HttpPost]
        [Route("insert-a-comment-record")]
        public IActionResult AddPostComments(PostComments model)
        {
            string uploadMsg = _postServices.AddPostComments(model);

            if (uploadMsg == "Saved Successfully")
            {
                return Ok(uploadMsg);
            }
            else
            {
                return BadRequest(uploadMsg);
            }
        }

        [HttpPost]
        [Route("update-a-comment-record")]
        public IActionResult UpdatePostComments(PostComments model)
        {
            string uploadMsg = _postServices.UpdatePostComments(model);

            if (uploadMsg == "Updated Successfully")
            {
                return Ok(uploadMsg);
            }
            else
            {
                return BadRequest(uploadMsg);
            }
        }

        [HttpPost]
        [Route("delete-a-comment-record")]
        public IActionResult DeletePostComments(PostComments model)
        {
            string uploadMsg = _postServices.DeletePostComments(model.postsCommentID, model.postsID);

            if (uploadMsg == "Delete Successful")
            {
                return Ok(uploadMsg);
            }
            else
            {
                return BadRequest(uploadMsg);
            }
        }

        [HttpPost]
        [Route("get-comment-record")]
        public IEnumerable<PostComments> GetPostComments(PostComments model)
        {
            List<PostComments> comments = new List<PostComments>();
            comments = _postServices.GetPostComments(model.postsID);
            return comments;
        }

        [HttpPost]
        [Route("update-like-record")]
        public IActionResult UpdatePostLikes(PostLikes model)
        {
            string uploadMsg = _postServices.UpdatePostLikes(model);

            if (uploadMsg == "Saved Successfully")
            {
                return Ok(uploadMsg);
            }
            else
            {
                return BadRequest(uploadMsg);
            }
        }

        [HttpPost]
        [Route("get-like-record")]
        public IEnumerable<PostLikes> GetPostLikes(PostLikes model)
        {
            List<PostLikes> likes = new List<PostLikes>();
            likes = _postServices.GetPostLikes(model.postsID);
            return likes;
        }
    }
}