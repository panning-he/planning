using System.Collections.Generic;

namespace Game.Utils.Cache
{
    /// <summary>
    /// 数据缓存接口
    /// </summary>
    public interface ICache
    {
        /// <summary>
        /// 手动设置到期时间的缓存名称
        /// </summary>
        string ExpireTimeStr
        {
            get;
        }

        /// <summary>
        /// 按索引获取和设置值
        /// </summary>
        /// <param name="key"></param>
        /// <returns></returns>
        object this[string key]
        {
            get;
        }

        /// <summary>
        /// 添加数据到缓存
        /// </summary>
        /// <param name="key">缓存中的键名</param>
        /// <param name="value">值</param>
        void Add(string key,object value);

        /// <summary>
        /// 添加数据到缓存
        /// </summary>
        /// <param name="key">缓存中的键名</param>
        /// <param name="value">值</param>
        /// <param name="timeout">手动指定过期时间</param>
        void Add(string key,object value,int? timeout);

        /// <summary>
        /// 添加数据到缓存
        /// </summary>
        /// <param name="dic">要添加的键值对列表</param>
        void Add(Dictionary<string,object> dic);

        /// <summary>
        /// 添加数据到缓存，并设置过期时间
        /// </summary>
        /// <param name="dic">要添加的键值对列表</param>
        /// <param name="timeout">过期时间</param>
        void Add(Dictionary<string,object> dic,int? timeout);

        /// <summary>
        /// 清空缓存
        /// </summary>
        void Delete();

        /// <summary>
        /// 从缓存中删除数据
        /// </summary>
        /// <param name="key">要删除的键名</param>
        void Delete(string key);

        /// <summary>
        /// 更新缓存的数据
        /// </summary>
        /// <param name="key">要更新的键名</param>
        /// <param name="value">新的值</param>
        void Update(string key,object value);

        /// <summary>
        /// 更新缓存的数据
        /// </summary>
        /// <param name="dic">要更新的键值对</param>
        void Update(Dictionary<string,object> dic);

        /// <summary>
        /// 根据键名获取一个缓存的值
        /// </summary>
        /// <param name="key">键名</param>
        /// <returns></returns>
        object GetValue(string key);
    }
}
