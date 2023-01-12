interface IObjectProperty {
    type: 'object';
    properties: {
        [key: string]: IProperty
    };
    description?: string;
    additionalProperties: boolean;
    $$ref: string;
}

interface IIntegerProperty {
    type: 'integer',
    description?: string;
    format: string;
}

interface IStringProperty {
    type: 'string',
    description?: string;
    nullable: boolean;
}

interface IArrayProperty {
    type: 'array',
    items: IProperty;
    description?: string;
    nullable: boolean;
}

interface IBoolProperty {
    type: 'boolean';
    description?: string;
}

type IProperty = IObjectProperty | IIntegerProperty | IStringProperty | IArrayProperty | IBoolProperty