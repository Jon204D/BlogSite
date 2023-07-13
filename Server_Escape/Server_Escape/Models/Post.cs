namespace Server_Escape.Models
{
    public class Post
    {
        public int PostsID { get; set; }
        public string? PostsTitle { get; set; }
        public string? PostsCaption { get; set; }
        public string? PostsAuthor { get; set; }
        public int? PostsLikes { get; set; }
        public int? PostsComments { get; set; }
        public string? CreatedOn { get; set; }
    }
}
