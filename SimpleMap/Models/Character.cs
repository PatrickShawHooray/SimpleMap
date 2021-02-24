using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace SimpleMap.Models
{
    public class Character
    {
        public string Player { get; set; }
        public string Name { get; set; }
        public int SortOrder { get; set; }
        public string Image { get; set; }
        public string Race { get; set; }
        public string Class { get; set; }
        public int HP { get; set; }
        public int TotalHP { get; set; }

        [Display(Name = "Armor Class")]
        public int AC { get; set; }
        public string Condition { get; set; }
    }

    public class CharacterList
    {
        public List<Character> ChList { get; set; }
    }
}