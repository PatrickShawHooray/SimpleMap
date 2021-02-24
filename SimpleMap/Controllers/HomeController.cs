using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.IO;
using SimpleMap.Models;
using System.Web.Script.Serialization;
using Newtonsoft.Json;

namespace SimpleMap.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            var Chars = JsonConvert.DeserializeObject<List<Character>>(System.IO.File.ReadAllText(@"C:\Users\Patrick\source\repos\SimpleMap\SimpleMap\Content\SaveData\characters.json"));
            Chars = Chars.OrderBy(c => c.SortOrder).ToList();

            string monsterText = System.IO.File.ReadAllText(@"C:\Users\Patrick\source\repos\SimpleMap\SimpleMap\Content\SaveData\monster.txt");

            string[] allMapFiles = Directory.GetFiles(@"C:\Users\Patrick\source\repos\SimpleMap\SimpleMap\Content\Maps", "*.*");
            List<string> fileNames = new List<string>();
            List<SelectListItem> mapItems = new List<SelectListItem>();
            foreach(string f in allMapFiles)
            {
                mapItems.Add(new SelectListItem
                {
                    Text = Path.GetFileName(f), Value = Path.GetFileName(f)
                });       
            }

            ViewBag.MonsterText = monsterText;
            ViewBag.Chars = Chars;
            ViewBag.Maps = mapItems;

            return View();
        }

        [HttpPost]
        public ActionResult SaveMonster(string textToSave)
        {
            System.IO.File.WriteAllText(@"C:\Users\Patrick\source\repos\SimpleMap\SimpleMap\Content\SaveData\monster.txt", textToSave);
            return Json("Success", JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult SaveChars(Character [] chars)
        {
            List<Character> SavedChars = JsonConvert.DeserializeObject<List<Character>>(System.IO.File.ReadAllText(@"C:\Users\Patrick\source\repos\SimpleMap\SimpleMap\Content\SaveData\characters.json"));

            for(int i = 0; i < chars.Length; i++)
            {
                Character thisChar = SavedChars.Where(c => c.Name == chars[i].Name).First();
                thisChar.AC = chars[i].AC;
                thisChar.Condition = chars[i].Condition;
                thisChar.HP = chars[i].HP;
                thisChar.TotalHP = chars[i].TotalHP;
                thisChar.SortOrder = chars[i].SortOrder;
            }

            string jsonChars = JsonConvert.SerializeObject(SavedChars, Newtonsoft.Json.Formatting.Indented);
            System.IO.File.WriteAllText(@"C:\Users\Patrick\source\repos\SimpleMap\SimpleMap\Content\SaveData\characters.json", jsonChars);

            return Json("Success", JsonRequestBehavior.AllowGet);
        }
    }
}