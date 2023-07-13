namespace Server_Escape.Models
{
    public class User
    {
        public int UserID { get; set; }
        public string? UserUsername { get; set; }
        public string? UserFirstName { get; set; }
        public string? UserLastName { get; set; }
        public string? UserEmail { get; set; }
        public string? UserPassword { get;  set; }
        public string? UserVerified { get; set; }
        public string? UserAdmin { get; set; }
        public string? UserNewPassword { get; set; }

    }
}