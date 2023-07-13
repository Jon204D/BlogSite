namespace Server_Escape.Models
{
    public class PostLikes
    {
        public int postsLikeID { get; set; }
        public int postsID { get; set; }
        public string? postsLikeAuthor { get; set; }
        public string? CreatedOn { get; set; }
    }
}
