using System;
using System.Collections.Generic;
using System.Text;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace UnitTest.TestHelp
{
    /// <summary>
    /// 验证类 单元测试
    /// </summary>
    [TestClass]
    public class TestValidate
    {
        [TestMethod]
        [DataRow("办公财务", true)]
        [DataRow("DbInitializer", false)]
        [DataRow("Data/DbInitializer.cs", false)]
        [DataRow("龘靐齉齾龗麤鱻爩龖吁", true)]
        public void Test_IsCnChar(string str, bool expectResult)
        {
            var result = Help.Validate.IsCnChar(str);
            Assert.AreEqual(expectResult, result);
        }

        [TestMethod]
        [DataRow("办公财务wo12321", true)]
        [DataRow("办公财务wo12321/", false)]
        [DataRow("办公财务wo12321*", false)]
        [DataRow("龘靐齉齾龗麤鱻爩龖吁", true)]
        public void Test_IsCnCharAndWordAndNum(string str, bool expectResult)
        {
            var result = Help.Validate.IsCnCharAndWordAndNum(str);
            Assert.AreEqual(expectResult, result);
        }

        [TestMethod]
        [DataRow("hetaoz@163.com", true)]
        [DataRow("he_taoz@163.com", true)]
        [DataRow("he__taoz@163.com", true)]
        [DataRow("he_taoz@163.com.cn", true)]
        [DataRow("he_taoz163.com", false)]
        [DataRow("he_taoz@163", false)]
        public void Test_IsEmail(string str, bool expectResult)
        {
            var result = Help.Validate.IsEmail(str);
            Assert.AreEqual(expectResult, result);
        }

        [TestMethod]
        [DataRow("192.168.0.1", true)]
        [DataRow("::1", true)]
        [DataRow("127.0.0", false)]
        [DataRow("333.0.0.1", false)]
        [DataRow("2001:0DB8:0000:0023:0008:0800:200C:417A", true)]
        [DataRow("2001:0DB8:0000:0023:0008:0800:", false)]
        [DataRow("2001:0DB8:0000:0023:0008:0800", false)]
        public void Test_IsIP(string str, bool expectResult)
        {
            var result = Help.Validate.IsIP(str);
            Assert.AreEqual(expectResult, result);
        }
    }
}
