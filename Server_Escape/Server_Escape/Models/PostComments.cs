namespace Server_Escape.Models
{
    public class PostComments
    {
        public int postsCommentID { get; set; }
        public int postsID { get; set; }
        public string? postsComment { get; set; }
        public string? postsCommentAuthor { get; set; }
        public string? CreatedOn { get; set; }
    }
}
