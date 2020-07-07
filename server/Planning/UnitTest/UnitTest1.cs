using Microsoft.VisualStudio.TestTools.UnitTesting;
using Web.Controllers;
using Web.Data;

namespace UnitTest
{
    [TestClass]
    public class UnitTest1
    {
        [TestMethod]
        [DataRow("30", true)]
        [DataRow("aa", false)]
        [DataRow("bb", false)]
        [DataRow("-1", true)]
        public void TestMethod1(string value, bool expectResult)
        {
            bool result = Help.Validate.IsNumeric(value);
            Assert.AreEqual(expectResult, result);
        }
    }
}
