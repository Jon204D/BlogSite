using Dapper;
using Microsoft.Extensions.Hosting;
using Server_Escape.Models;
using System.Data;
using System.Data.SqlClient;

namespace Server_Escape.Services
{
    public class PostServices : IPostServices
    {
        public readonly IConfiguration _configuration;

        public PostServices(IConfiguration configuration)
        {
            _configuration = configuration;
            ConnectionString = _configuration.GetConnectionString("DBConnection");
            ProviderName = "System.Data.SqlClient";
        }
        public string ConnectionString { get; }
        public string ProviderName { get; }

        public IDbConnection Connection
        {
            get
            {
                return new SqlConnection(ConnectionString);
            }
        }

        public string InsertPostRecord(Post model)
        {
            using (IDbConnection dbConnection = Connection)
            {
                try
                {
                    dbConnection.Open();
                    dbConnection.Query<Post>("SP_InsertPostData", new { postTitle = model.PostsTitle, postCaption = model.PostsCaption, postAuthor = model.PostsAuthor }, commandType: CommandType.StoredProcedure);
                    dbConnection.Close();

                    return "Uploaded Successfully";
                }
                catch (Exception)
                {
                    return "An Error Occured";
                }
            }
        }

        public List<Post> GetAllPostRecord()
        {
            List<Post> posts = new List<Post>();

            using (IDbConnection dbConnection = Connection)
            {
                try
                {
                    dbConnection.Open();
                    posts = dbConnection.Query<Post>("SP_GetPostData", commandType: CommandType.StoredProcedure).ToList();
                    dbConnection.Close();

                    return posts;
                }
                catch (Exception)
                {
                    return posts;
                }
            }
        }

        public List<Post> GetAPostRecord(int PostID)
        {
            List<Post> posts = new List<Post>();

            using (IDbConnection dbConnection = Connection)
            {
                try
                {
                    dbConnection.Open();
                    posts = dbConnection.Query<Post>("SP_GetAPostData", new { postID = PostID }, commandType: CommandType.StoredProcedure).ToList();
                    dbConnection.Close();

                    return posts;
                }
                catch (Exception)
                {
                    return posts;
                }
            }
        }

        public List<Post> GetArtistPostRecord(string PostsAuthor)
        {
            List<Post> posts = new List<Post>();

            using (IDbConnection dbConnection = Connection)
            {
                try
                {
                    dbConnection.Open();
                    posts = dbConnection.Query<Post>("SP_GetArtistPostData", new { postAuthor = PostsAuthor }, commandType: CommandType.StoredProcedure).ToList();
                    dbConnection.Close();

                    return posts;
                }
                catch (Exception)
                {
                    return posts;
                }
            }
        }

        public string UpdateAPostRecord(Post model)
        {
            using (IDbConnection dbConnection = Connection)
            {
                try
                {
                    dbConnection.Open();
                    dbConnection.Query<Post>("SP_UpdateAPostData", new { postID = model.PostsID, postTitle = model.PostsTitle, postCaption = model.PostsCaption }, commandType: CommandType.StoredProcedure);
                    dbConnection.Close();

                    return "Updated Successfully";
                }
                catch (Exception)
                {
                    return "An Error Occured";
                }
            }
        }

        public string DeleteAPostRecord(int PostID)
        {
            using (IDbConnection dbConnection = Connection)
            {
                try
                {
                    dbConnection.Open();
                    dbConnection.Query<Post>("SP_DeleteAPostData", new { postID = PostID }, commandType: CommandType.StoredProcedure).ToList();
                    dbConnection.Close();

                    return "Delete Successful";
                }
                catch (Exception)
                {
                    return "An Error Occured";
                }
            }
        }

        public string AddPostComments(PostComments model)
        {
            List<Post> posts = new List<Post>();
            using (IDbConnection dbConnection = Connection)
            {
                try
                {
                    dbConnection.Open();
                    dbConnection.Query<PostComments>("SP_InsertCommentData", new { postID = model.postsID, postComment = model.postsComment, postCommentAuthor = model.postsCommentAuthor }, commandType: CommandType.StoredProcedure);
                    dbConnection.Close();

                    dbConnection.Open();
                    posts = dbConnection.Query<Post>("SP_GetAPostData", new { postID = model.postsID }, commandType: CommandType.StoredProcedure).ToList();
                    dbConnection.Close();

                    int numOfComments = (int)posts[0].PostsComments + 1;

                    dbConnection.Open();
                    posts = dbConnection.Query<Post>("SP_UpdatePostNumCommentData", new { postID = model.postsID, postComments = numOfComments }, commandType: CommandType.StoredProcedure).ToList();
                    dbConnection.Close();

                    return "Saved Successfully";
                }
                catch (Exception)
                {
                    return "An Error Occured";
                }
            }
        }

        public string UpdatePostComments(PostComments model)
        {
            List<Post> posts = new List<Post>();
            List<PostComments> comments = new List<PostComments>();

            using (IDbConnection dbConnection = Connection)
            {
                try
                {
                    dbConnection.Open();
                    dbConnection.Query<PostComments>("SP_UpdateCommentData", new { postCommentID = model.postsCommentID, postComment = model.postsComment }, commandType: CommandType.StoredProcedure);
                    dbConnection.Close();

                    return "Updated Successfully";
                }
                catch (Exception)
                {
                    return "An Error Occured";
                }
            }
        }

        public string DeletePostComments(int PostCommentID, int PostID)
        {
            List<Post> posts = new List<Post>();
            using (IDbConnection dbConnection = Connection)
            {
                try
                {
                    dbConnection.Open();
                    dbConnection.Query<Post>("SP_DeleteACommentData", new { postCommentID = PostCommentID }, commandType: CommandType.StoredProcedure).ToList();
                    dbConnection.Close();

                    dbConnection.Open();
                    posts = dbConnection.Query<Post>("SP_GetAPostData", new { postID = PostID }, commandType: CommandType.StoredProcedure).ToList();
                    dbConnection.Close();

                    int numOfComments = (int)posts[0].PostsComments - 1;

                    if (numOfComments < 0)
                    {
                        numOfComments = 0;
                    }

                    dbConnection.Open();
                    posts = dbConnection.Query<Post>("SP_UpdatePostNumCommentData", new { postID = PostID, postComments = numOfComments }, commandType: CommandType.StoredProcedure).ToList();
                    dbConnection.Close();

                    return "Delete Successful";
                }
                catch (Exception)
                {
                    return "An Error Occured";
                }
            }
        }

        public List<PostComments> GetPostComments(int PostID)
        {
            List<PostComments> comments = new List<PostComments>();

            using (IDbConnection dbConnection = Connection)
            {
                try
                {
                    dbConnection.Open();
                    comments = dbConnection.Query<PostComments>("SP_GetCommentData", new { postID = PostID }, commandType: CommandType.StoredProcedure).ToList();
                    dbConnection.Close();

                    return comments;
                }
                catch (Exception)
                {
                    return comments;
                }
            }
        }

        public string UpdatePostLikes(PostLikes model)
        {
            List<Post> posts = new List<Post>();
            List<PostLikes> likes = new List<PostLikes>();

            using (IDbConnection dbConnection = Connection)
            {
                try
                {
                    dbConnection.Open();
                    likes = dbConnection.Query<PostLikes>("SP_SearchAPostLikeData", new { postID = model.postsID, postLikeAuthor = model.postsLikeAuthor }, commandType: CommandType.StoredProcedure).ToList();
                    dbConnection.Close();

                    if (likes.Count == 0)
                    {
                        dbConnection.Open();
                        dbConnection.Query<PostLikes>("SP_InsertLikeData", new { postID = model.postsID, postLikeAuthor = model.postsLikeAuthor }, commandType: CommandType.StoredProcedure);
                        dbConnection.Close();

                        dbConnection.Open();
                        posts = dbConnection.Query<Post>("SP_GetAPostData", new { postID = model.postsID }, commandType: CommandType.StoredProcedure).ToList();
                        dbConnection.Close();

                        int numOfLikes = (int)posts[0].PostsLikes + 1;

                        dbConnection.Open();
                        posts = dbConnection.Query<Post>("SP_UpdatePostNumLikeData", new { postID = model.postsID, postLikes = numOfLikes }, commandType: CommandType.StoredProcedure).ToList();
                        dbConnection.Close();
                    }
                    else
                    {
                        dbConnection.Open();
                        dbConnection.Query<PostLikes>("SP_DeleteLikeData", new { postID = model.postsID, postLikeAuthor = model.postsLikeAuthor }, commandType: CommandType.StoredProcedure);
                        dbConnection.Close();

                        dbConnection.Open();
                        posts = dbConnection.Query<Post>("SP_GetAPostData", new { postID = model.postsID }, commandType: CommandType.StoredProcedure).ToList();
                        dbConnection.Close();

                        int numOfLikes = (int)posts[0].PostsLikes - 1;

                        if (numOfLikes < 0)
                        {
                            numOfLikes = 0;
                        }

                        dbConnection.Open();
                        posts = dbConnection.Query<Post>("SP_UpdatePostNumLikeData", new { postID = model.postsID, postLikes = numOfLikes }, commandType: CommandType.StoredProcedure).ToList();
                        dbConnection.Close();
                    }

                    return "Saved Successfully";
                }
                catch (Exception)
                {
                    return "An Error Occured";
                }
            }
        }
        public List<PostLikes> GetPostLikes(int PostID)
        {
            List<PostLikes> likes = new List<PostLikes>();

            using (IDbConnection dbConnection = Connection)
            {
                try
                {
                    if (PostID == -1)
                    {
                        dbConnection.Open();
                        likes = dbConnection.Query<PostLikes>("SP_GetAllLikeData", commandType: CommandType.StoredProcedure).ToList();
                        dbConnection.Close();
                    }
                    else
                    {
                        dbConnection.Open();
                        likes = dbConnection.Query<PostLikes>("SP_GetLikeData", new { postID = PostID }, commandType: CommandType.StoredProcedure).ToList();
                        dbConnection.Close();
                    }

                    return likes;
                }
                catch (Exception)
                {
                    return likes;
                }
            }
        }
    }

    public interface IPostServices
    {
        public string InsertPostRecord(Post model);
        public List<Post> GetAllPostRecord();
        public List<Post> GetAPostRecord(int PostID);
        public List<Post> GetArtistPostRecord(string PostsAuthor);
        public string UpdateAPostRecord(Post model);
        public string DeleteAPostRecord(int PostID);
        public string AddPostComments(PostComments model);
        public string UpdatePostComments(PostComments model);
        public string DeletePostComments(int PostCommentID, int PostID);
        public List<PostComments> GetPostComments(int PostID);
        public string UpdatePostLikes(PostLikes model);
        public List<PostLikes> GetPostLikes(int PostID);
    }
}
