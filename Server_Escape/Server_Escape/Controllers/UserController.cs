using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Server_Escape.Functions;
using Server_Escape.Models;
using Server_Escape.Services;

namespace Server_Escape.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        //Allow custom return statement
        public readonly IUserServices _userServices;
        public UserController(IUserServices userServices)
        {
            _userServices = userServices;
        }

        /*
         * Post method instead of Get so that the data is not accessible on the server side.
         */
        [HttpPost]
        [Route("insert-user-record")]
        public IActionResult InsertUserRecord(User model)
        {
            string uploadMsg = _userServices.InsertUserRecord(model);

            if (uploadMsg == "Saved Successfully")
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
        [Route("verify-user-login")]
        public IActionResult VerifyUserLogin(User model)
        {
            LoginObject uploadMsg = _userServices.VerifyUserLogin(model);
            return Ok(uploadMsg);
        }

        /*
         * Post method instead of Get so that the data is not accessible on the server side.
         */
        [HttpPost]
        [Route("get-user-record")]
        public IEnumerable<User> GetAllUsersRecord()
        {
            List<User> users = new List<User>();
            users = _userServices.GetAllUsersRecord();
            return users;
        }

        /*
         * Post method instead of Get so that the data is not accessible on the server side.
         */
        [HttpPost]
        [Route("get-a-user-record")]
        public IEnumerable<User> GetAUsersRecord(User model)
        {
            List<User> user = new List<User>();
            user = _userServices.GetAUsersRecord(model);
            return user;
        }

        /*
         * Post method instead of Get so that the data is not accessible on the server side.
         */
        [HttpPost]
        [Route("update-a-user-record")]
        public IActionResult UpdateAUsersRecord(User model)
        {
            string updateMsg = _userServices.UpdateAUsersRecord(model);

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
        [Route("delete-a-user-record")]
        public IActionResult DeleteAUsersRecord(User model)
        {
            string deleteMsg = _userServices.DeleteAUsersRecord(model);

            if (deleteMsg == "Delete Successful")
            {
                return Ok(deleteMsg);
            }
            else
            {
                return BadRequest(deleteMsg);
            }
        }
    }
}