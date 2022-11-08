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
            var Chars = JsonConvert.DeserializeObject<List<Character>>(System.IO.File.ReadAllText(@"C:\Users\Patri\source\repos\SimpleMap\SimpleMap\Content\SaveData\characters.json"));
            Chars = Chars.OrderBy(c => c.SortOrder).ToList();

            string monsterText = System.IO.File.ReadAllText(@"C:\Users\Patri\source\repos\SimpleMap\SimpleMap\Content\SaveData\monster.txt");

            string[] allMapFiles = Directory.GetFiles(@"C:\Users\Patri\source\repos\SimpleMap\SimpleMap\Content\Maps", "*.*");
            
            List<SelectListItem> mapItems = new List<SelectListItem>();
            mapItems.Add(new SelectListItem
            {
                Text = "",
                Value = ""
            });
            foreach (string f in allMapFiles)
            {
                mapItems.Add(new SelectListItem
                {
                    Text = Path.GetFileName(f), Value = Path.GetFileName(f)
                });       
            }

            foreach(Character c in Chars)
            {
                if(c.Name.Length > 18)
                {
                    c.Name = c.Name.Substring(0, 18);
                }
            }

            ViewBag.MonsterText = monsterText;
            ViewBag.Chars = Chars;
            ViewBag.Maps = mapItems;

            return View();
        }

        public ActionResult Index2()
        {
            var Chars = JsonConvert.DeserializeObject<List<Character>>(System.IO.File.ReadAllText(@"C:\Users\Patri\source\repos\SimpleMap\SimpleMap\Content\SaveData\characters.json"));
            Chars = Chars.OrderBy(c => c.SortOrder).ToList();

            string monsterText = System.IO.File.ReadAllText(@"C:\Users\Patri\source\repos\SimpleMap\SimpleMap\Content\SaveData\monster.txt");

            string[] allMapFiles = Directory.GetFiles(@"C:\Users\Patri\source\repos\SimpleMap\SimpleMap\Content\Maps", "*.*");

            List<SelectListItem> mapItems = new List<SelectListItem>();
            mapItems.Add(new SelectListItem
            {
                Text = "",
                Value = ""
            });
            foreach (string f in allMapFiles)
            {
                mapItems.Add(new SelectListItem
                {
                    Text = Path.GetFileName(f),
                    Value = Path.GetFileName(f)
                });
            }

            foreach (Character c in Chars)
            {
                if (c.Name.Length > 18)
                {
                    c.Name = c.Name.Substring(0, 18);
                }
            }

            ViewBag.MonsterText = monsterText;
            ViewBag.Chars = Chars;
            ViewBag.Maps = mapItems;

            return View();
        }

        [HttpPost]
        public ActionResult SaveMonster(string textToSave)
        {
            System.IO.File.WriteAllText(@"C:\Users\Patri\source\repos\SimpleMap\SimpleMap\Content\SaveData\monster.txt", textToSave);
            return Json("Success", JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult SaveChars(Character [] chars)
        {
            try
            {
                List<Character> SavedChars = JsonConvert.DeserializeObject<List<Character>>(System.IO.File.ReadAllText(@"C:\Users\Patri\source\repos\SimpleMap\SimpleMap\Content\SaveData\characters.json"));

                if (chars != null)
                {
                    for (int i = 0; i < chars.Length; i++)
                    {
                        Character thisChar = SavedChars.Where(c => c.PlayerID == chars[i].PlayerID).First();
                        thisChar.AC = chars[i].AC;
                        thisChar.Condition = chars[i].Condition;
                        thisChar.HP = chars[i].HP;
                        thisChar.TotalHP = chars[i].TotalHP;
                        thisChar.SortOrder = chars[i].SortOrder;
                        thisChar.GP = chars[i].GP;
                        thisChar.SP = chars[i].SP;
                        thisChar.CP = chars[i].CP;
                        thisChar.XP = chars[i].XP;
                        thisChar.Level = chars[i].Level;
                    }

                    string jsonChars = JsonConvert.SerializeObject(SavedChars, Newtonsoft.Json.Formatting.Indented);
                    System.IO.File.WriteAllText(@"C:\Users\Patri\source\repos\SimpleMap\SimpleMap\Content\SaveData\characters.json", jsonChars);

                }

            }
            catch(Exception ex)
            {
                String message = ex.Message;
                return Json("Error", JsonRequestBehavior.AllowGet);
            }
            


            return Json("Success", JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult SaveCharsBattleMap(Character[] chars)
        {
            try
            {
                List<Character> SavedChars = JsonConvert.DeserializeObject<List<Character>>(System.IO.File.ReadAllText(@"C:\Users\Patri\source\repos\SimpleMap\SimpleMap\Content\SaveData\characters.json"));

                if (chars != null)
                {
                    for (int i = 0; i < chars.Length; i++)
                    {
                        Character thisChar = SavedChars.Where(c => c.PlayerID == chars[i].PlayerID).First();
                        thisChar.AC = chars[i].AC;
                        thisChar.Condition = chars[i].Condition;
                        thisChar.HP = chars[i].HP;
                        thisChar.TotalHP = chars[i].TotalHP;
                        thisChar.SortOrder = chars[i].SortOrder;
                    }

                    string jsonChars = JsonConvert.SerializeObject(SavedChars, Newtonsoft.Json.Formatting.Indented);
                    System.IO.File.WriteAllText(@"C:\Users\Patri\source\repos\SimpleMap\SimpleMap\Content\SaveData\characters.json", jsonChars);
                }

            }
            catch (Exception ex)
            {
                String message = ex.Message;
                return Json("Error", JsonRequestBehavior.AllowGet);
            }

            return Json("Success", JsonRequestBehavior.AllowGet);
        }
    }
}