 //封装 serializeObject函数, 将表单中的用户输入的内容转换为对象类型
        function serializeToJson(obj) {
                //处理结果对象
                var results = {};
                var params = obj.serializeArray(); //将表单对象转换为数组
                //[{name:'username',value:'用户输入的内容'},{name:'password',value:'用户输入的内容'}]
                // console.log(params);
                //循环数组 将数组转换为对象类型
                $.each(params, function (index, value) {
                    //将属性和属性值存入新对象
                    results[value.name] = value.value;
                });
                //将处理结果返回到函数外部
                return results;
            };