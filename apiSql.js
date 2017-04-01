var sql = require('mssql');
// var config = require('./mssql.config.prod.json');
var config = require('./mssql.config.local.json');

module.exports = function (router) {
    router.post('/:procname', function (req, res) {

        var procName = req.params.procname;
        const { parameters = [], fields = [] } = req.body;

        sql.connect(config)
            .then(function () {
                const sqlReq = new sql.Request();
                parameters.map(params => {
                    const error = MapParameters(params, sqlReq);
                    if (error) {
                        res.json({
                            ResultOk: false,
                            ResultMessage: error
                        });
                        return;
                    }
                });
                sqlReq.execute(procName).then(function (recordsets) {
                    res.json({
                        ResultOk: true,
                        ResultMessage: 'Операция выполнена успешно',
                        Recordset: recordsets && recordsets.length > 0 ? recordsets[0] : [],
                        Output: MapOutputParameters(sqlReq.parameters, GetOutputFields(parameters))
                    })
                }).catch(function (err) {
                    res.json({
                        ResultOk: false,
                        ResultMessage: err.precedingErrors && err.precedingErrors.length && err.precedingErrors[0].message
                            ? err.precedingErrors[0].message
                            : err.message
                    });
                });

            }).catch(function (err) {
                res.json({
                    ResultOk: false,
                    ResultMessage: err.message
                });
            });

    });
}

function MapOutputParameters(params, fields) {
    const output = {};
    fields.map(f => {
        const key = Object.keys(params || {}).find(p => p === f);
        if (key)
            output[key] = params[key].value;
    })
    return output;
}

function GetOutputFields(parameters) {
    return (parameters || [])
        .filter(x => x.direction === 'output')
        .map(x => x.name)
}

function MapParameters(params, sqlRequest) {
    const { name, value, direction } = params;
    if (!name)
        return 'Отсутствует обязательное поле name';
    if (!/^(input|output|inputoutput)$/.test(direction, 'g'))
        return 'Поле deirection может быть только input, output, inputoutput';
    // if (direction === 'input' && !value)
    //     return 'Отсутствует поле value';


    switch (direction.toLowerCase()) {
        case 'input':
        case 'inputoutput':
            sqlRequest.input(name, sql.NVarChar, value);
            return;
        case 'output':
            sqlRequest.output(name, sql.NVarChar)
    }
}