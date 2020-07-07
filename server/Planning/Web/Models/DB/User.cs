using System;
using System.ComponentModel.DataAnnotations;

namespace Web.Models.DB
{
    public class User
    {
        [Key]
        public int UserID { get; set; }

        [StringLength(32)]
        public string Password { get; set; }

        [StringLength(32)]
        public string OpenID { get; set; }

        [StringLength(32)]
        public string Nickname { get; set; }
        
        public string AvatarUrl { get; set; }

        public byte Gender { get; set; }

        [StringLength(32)]
        public string Country { get; set; }

        [StringLength(32)]
        public string Province { get; set; }

        [StringLength(32)]
        public string City { get; set; }

        [StringLength(32)]
        public string UnionID { get; set; }

        [StringLength(32)]
        public string Mobile { get; set; }

        public int VipLevel { get; set; }

        public DateTime RegTime { get; set; }

        public string RegIP { get; set; }

        public DateTime LastLoginTime { get; set; }

        public string LastLoginIP { get; set; }
    }
}