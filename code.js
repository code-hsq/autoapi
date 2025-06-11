let options = {
  "swaggerDoc": {
    "openapi": "3.0.0",
    "paths": {
      "/": {
        "get": {
          "operationId": "AppController_getHello",
          "parameters": [],
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "string"
                  }
                }
              }
            }
          },
          "tags": ["App"]
        }
      },
      "/user": {
        "post": {
          "operationId": "UserController_create",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/CreateUserDto"
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": ""
            },
            "default": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/OmitTypeClass"
                  }
                }
              }
            }
          },
          "security": [{
            "bearer": []
          }],
          "summary": "创建用户",
          "tags": ["User"]
        },
        "get": {
          "operationId": "UserController_findAll",
          "parameters": [{
            "name": "pageNumber",
            "required": false,
            "in": "query",
            "description": "页码",
            "schema": {
              "minimum": 1,
              "example": 1,
              "type": "number"
            }
          }, {
            "name": "pageSize",
            "required": false,
            "in": "query",
            "description": "每页数量",
            "schema": {
              "example": 10,
              "type": "number"
            }
          }],
          "responses": {
            "200": {
              "description": ""
            }
          },
          "security": [{
            "bearer": []
          }],
          "tags": ["User"]
        }
      },
      "/user/{id}": {
        "get": {
          "operationId": "UserController_findOne",
          "parameters": [{
            "name": "id",
            "required": true,
            "in": "path",
            "schema": {
              "type": "string"
            }
          }],
          "responses": {
            "200": {
              "description": ""
            }
          },
          "security": [{
            "bearer": []
          }],
          "tags": ["User"]
        },
        "patch": {
          "operationId": "UserController_update",
          "parameters": [{
            "name": "id",
            "required": true,
            "in": "path",
            "schema": {
              "type": "string"
            }
          }],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UpdateUserDto"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object"
                  }
                }
              }
            }
          },
          "security": [{
            "bearer": []
          }],
          "tags": ["User"]
        },
        "delete": {
          "operationId": "UserController_remove",
          "parameters": [{
            "name": "id",
            "required": true,
            "in": "path",
            "schema": {
              "type": "string"
            }
          }],
          "responses": {
            "200": {
              "description": ""
            }
          },
          "security": [{
            "bearer": []
          }],
          "tags": ["User"]
        }
      },
      "/user/test": {
        "post": {
          "operationId": "UserController_testMongo",
          "parameters": [],
          "responses": {
            "201": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object"
                  }
                }
              }
            }
          },
          "security": [{
            "bearer": []
          }, {
            "bearer": []
          }],
          "tags": ["User"]
        }
      },
      "/user/login": {
        "post": {
          "operationId": "UserController_login",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/CreateUserDto"
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": ""
            }
          },
          "security": [{
            "bearer": []
          }],
          "tags": ["User"]
        }
      }
    },
    "info": {
      "title": "用户系统",
      "description": "用户系统接口文档",
      "version": "1.0",
      "contact": {}
    },
    "tags": [{
      "name": "user",
      "description": ""
    }],
    "servers": [],
    "components": {
      "securitySchemes": {
        "bearer": {
          "scheme": "bearer",
          "bearerFormat": "JWT",
          "type": "http"
        }
      },
      "schemas": {
        "CreateUserDto": {
          "type": "object",
          "properties": {
            "userName": {
              "type": "string",
              "description": "用户名",
              "example": "dmhsq",
              "maxLength": 12
            },
            "password": {
              "type": "string",
              "pattern": "/^[A-Za-z](?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{5,11}$/"
            }
          },
          "required": ["userName", "password"]
        },
        "OmitTypeClass": {
          "type": "object",
          "properties": {
            "no": {
              "type": "number"
            },
            "userId": {
              "type": "string"
            },
            "userName": {
              "type": "string"
            },
            "nickname": {
              "type": "string"
            },
            "description": {
              "type": "string"
            },
            "createTime": {
              "format": "date-time",
              "type": "string"
            },
            "updateTime": {
              "format": "date-time",
              "type": "string"
            },
            "wxId": {
              "type": "string"
            },
            "email": {
              "type": "string"
            },
            "vip": {
              "type": "number"
            }
          },
          "required": ["no", "userId", "userName", "nickname", "createTime", "updateTime", "vip"]
        },
        "UpdateUserDto": {
          "type": "object",
          "properties": {
            "userName": {
              "type": "string",
              "description": "用户名",
              "example": "dmhsq",
              "maxLength": 12
            },
            "password": {
              "type": "string",
              "pattern": "/^[A-Za-z](?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{5,11}$/"
            }
          }
        }
      }
    }
  },
  "customOptions": {}
};
export default options;