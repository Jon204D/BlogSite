using Dapper;
using Microsoft.AspNetCore.Identity;
using Server_Escape.Functions;
using Server_Escape.Models;
using System.Data;
using System.Data.SqlClient;

namespace Server_Escape.Services
{
    public class UserServices : IUserServices
    {
        public readonly IConfiguration _configuration;
        public UserServices(IConfiguration configuration)
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

        public string InsertUserRecord(User model)
        {
            using (IDbConnection dbConnection = Connection)
            {
                try
                {
                    dbConnection.Open();
                    dbConnection.Query<User>("SP_InsertUserData",new { userUsername = model.UserUsername.ToLower().Trim(), userFirstName = model.UserFirstName, userLastName = model.UserLastName, userEmail = model.UserEmail.ToLower(), userPassword = EncryptionHandler.Encrypt(model.UserPassword), userVerified = "true", userAdmin = "false" }, commandType: CommandType.StoredProcedure);
                    dbConnection.Close();

                    return "Saved Successfully";
                }
                catch (Exception)
                {
                    return "An Error Occured";
                }
            }
        }

        public LoginObject VerifyUserLogin(User model)
        {
            using (IDbConnection dbConnection = Connection)
            {
                LoginObject loginObject = new LoginObject();
                List<User> user = new List<User>();

                try
                {
                    dbConnection.Open();
                    List<User> usersCreds = dbConnection.Query<User>("SP_GetAUsersPasswordData", new { userUsername = model.UserUsername.ToLower().Trim() }, commandType: CommandType.StoredProcedure).ToList();
                    dbConnection.Close();

                    if (usersCreds.Count > 0)
                    {
                        string enteredCreds = EncryptionHandler.Encrypt(model.UserPassword).ToString();
                        string encryptedCreds = usersCreds[0].UserPassword.ToString().Trim();

                        if (enteredCreds.Equals(encryptedCreds))
                        {
                            dbConnection.Open();
                            user = dbConnection.Query<User>("SP_GetAUsersData", new { userUsername = model.UserUsername.ToLower().Trim() }, commandType: CommandType.StoredProcedure).ToList();
                            dbConnection.Close();

                            loginObject.loggedIn = true;
                            loginObject.username = user[0].UserUsername.ToString().Trim();
                            loginObject.isAdmin = user[0].UserAdmin.Trim();

                            return loginObject;
                        }
                        else
                        {
                            loginObject.loggedIn = false;
                            loginObject.message = "Incorrect Credentials";
                            return loginObject;
                        }
                    }
                    else
                    {
                        loginObject.loggedIn = false;
                        loginObject.message = "Account not found";
                        return loginObject;
                    }
                }
                catch (Exception)
                {
                    loginObject.loggedIn = false;
                    loginObject.message = "Server Side Error";
                    return loginObject;
                }
            }
        }


        public List<User> GetAllUsersRecord()
        {
            List<User> users = new List<User>();

            using (IDbConnection dbConnection = Connection)
            {
                try
                {
                    dbConnection.Open();
                    users = dbConnection.Query<User>("SP_GetAllUsersData", commandType: CommandType.StoredProcedure).ToList();
                    dbConnection.Close();

                    return users;
                }
                catch (Exception)
                {
                    return users;
                }
            }
        }

        public List<User> GetAUsersRecord(User model)
        {
            List<User> users = new List<User>();

            using (IDbConnection dbConnection = Connection)
            {
                try
                {
                    dbConnection.Open();
                    users = dbConnection.Query<User>("SP_GetAUsersData", new { UserUsername = model.UserUsername.ToLower().Trim() }, commandType: CommandType.StoredProcedure).ToList();
                    dbConnection.Close();

                    return users;
                }
                catch (Exception)
                {
                    return users;
                }
            }
        }

        public string UpdateAUsersRecord(User model)
        {
            using (IDbConnection dbConnection = Connection)
            {
                try
                {
                    if (model.UserPassword == null)
                    {
                        return "Current Password Must Be Provided";
                    }

                    dbConnection.Open();
                    List<User> usersCreds = dbConnection.Query<User>("SP_GetAUsersPasswordData", new { userUsername = model.UserUsername.ToLower().Trim() }, commandType: CommandType.StoredProcedure).ToList();
                    dbConnection.Close();

                    string enteredCreds = EncryptionHandler.Encrypt(model.UserPassword).ToString();
                    string encryptedCreds = usersCreds[0].UserPassword.ToString().Trim();

                    if (usersCreds.Count > 0)
                    {
                        if (enteredCreds.Equals(encryptedCreds))
                        {
                            if (model.UserNewPassword != null)
                            {
                                dbConnection.Open();
                                dbConnection.Query<User>("SP_UpdateAUsersData", new { userUsername = model.UserUsername.ToLower().Trim(), userFirstName = model.UserFirstName, userLastName = model.UserLastName, userEmail = model.UserEmail.ToLower(), userPassword = EncryptionHandler.Encrypt(model.UserNewPassword) }, commandType: CommandType.StoredProcedure);
                                dbConnection.Close();
                            }
                            else
                            {
                                dbConnection.Open();
                                dbConnection.Query<User>("SP_UpdateAUsersData", new { userUsername = model.UserUsername.ToLower().Trim(), userFirstName = model.UserFirstName, userLastName = model.UserLastName, userEmail = model.UserEmail.ToLower(), userPassword = EncryptionHandler.Encrypt(model.UserPassword) }, commandType: CommandType.StoredProcedure);
                                dbConnection.Close();
                            }
                            return "Updated Successfully";
                        }
                        else
                        {
                            return "Invalid Credentials";
                        }
                    }
                    else
                    {
                        return "Account Not Recognized";
                    }
                }
                catch (Exception)
                {
                    return "An Error Occured";
                }
            }
        }

        public string DeleteAUsersRecord(User model)
        {
            List<User> users = new List<User>();

            using (IDbConnection dbConnection = Connection)
            {
                try
                {
                    dbConnection.Open();
                    dbConnection.Execute("SP_DeleteAUsersData", new { userUsername = model.UserUsername }, commandType: CommandType.StoredProcedure);
                    dbConnection.Close();

                    return "Delete Successful";
                }
                catch (Exception)
                {
                    return "An Error Occured";
                }
            }
        }
    }

    public interface IUserServices
    {
        public string InsertUserRecord(User model);
        public LoginObject VerifyUserLogin(User model);
        public List<User> GetAllUsersRecord();
        public List<User> GetAUsersRecord(User model);
        public string UpdateAUsersRecord(User model);
        public string DeleteAUsersRecord(User model);
    }
}
