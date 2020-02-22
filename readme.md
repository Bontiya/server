# Bontiya server

### User

#### register / create
* POST
* `/auth/register`
* body `name=String *`, `email=String *`, `password=String *`, `gender=Enum('male', 'female') *`
* success 
    ```
        {
            _id: '5e50e1aedcf30452f258a785',
            name: 'Dzakki Achmed',
            email: 'dzakkiaz7@gmail.com',
            gender: 'male',
            token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1ZTUwZTFhZWRjZjMwNDUyZjI1OGE3ODUiLCJlbWFpbCI6ImR6YWtraWF6N0BnbWFpbC5jb20iLCJpYXQiOjE1ODIzNTg5NTh9.oi0uDc6WxnmIoi_rVHGyc4lAoVECDtL1_3nCRDwyQQE'
        }
    ```
#### login
* POST
* `/auth/login`
* body `email=String *`, `password=String *`
* success 
    ```
        {
            _id: '5e50e1aedcf30452f258a785',
            name: 'Dzakki Achmed',
            email: 'dzakkiaz7@gmail.com',
            gender: 'male',
            token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1ZTUwZTFhZWRjZjMwNDUyZjI1OGE3ODUiLCJlbWFpbCI6ImR6YWtraWF6N0BnbWFpbC5jb20iLCJpYXQiOjE1ODIzNTg5NTh9.oi0uDc6WxnmIoi_rVHGyc4lAoVECDtL1_3nCRDwyQQE'
        }
    ```

#### Get UserById
* GET
* /users/:id
* success
    ```
    {
        _id: '5e50e2a5448f6e5401583c84',
        name: 'Dzakki Achmed',
        email: 'dzakkiaz7@gmail.com',
        gender: 'male',
        created_at: '2020-02-22T08:13:25.688Z',
        updated_at: '2020-02-22T08:13:25.688Z'
    }
    ```

#### Get UserBySearchGmail
* GET
* /users/search?email=dzakki
* success
    ```
    [{
        _id: '5e50e2a5448f6e5401583c84',
        name: 'Dzakki Achmed',
        email: 'dzakkiaz7@gmail.com',
        gender: 'male',
        created_at: '2020-02-22T08:13:25.688Z',
        updated_at: '2020-02-22T08:13:25.688Z'
    }]
    ```

#### Update user
* PUT
* /users
* body `name=String *`, `email=String *`, `password=String *`, `gender=Enum('male', 'female')*`, `username = String *`
* success
    ```
    {
        _id: '5e50e3ec2ec0ef551091c2e9',
        name: 'Ahmad muzakki baru',
        email: 'dzakkiaz7@gmail.com',
        gender: 'male',
        created_at: '2020-02-22T08:18:52.965Z',
        updated_at: '2020-02-22T08:18:53.292Z',
        __v: 0,
        username: 'dzakki'
    }
    ```

#### Update password
* PATCH 
* /users/password
* body `password=String*`, `newPassword=String*`
* success 
    ```
    {
        _id: '5e50e3ec2ec0ef551091c2e9',
        name: 'Ahmad muzakki baru',
        email: 'dzakkiaz7@gmail.com',
        gender: 'male',
        created_at: '2020-02-22T08:18:52.965Z',
        updated_at: '2020-02-22T08:18:53.292Z',
        username: 'dzakki'
    }
    ```


### Event

#### create 
* POST
* `/events`
* header `authorization=token`
* body `name=string*`, `location=Obj`, `time=String`, `key=String`, `description=string`
    ```
        example
        {
            name: "Makan bareng",
            location: {
                name: "PIM",
                lat: 19.311143,
                lon: -1.406250
            },
            time : new Date().toDateString(),
            key: 'shoe',
            description: 'nothing',
        }
        
    ```
* success
    ```
    {
        location: { name: 'PIM', lat: 19.311143, lon: -1.40625 },
        members: [
            {
            _id: '5e50e5a33d3a0357272fc1b4',
            event: '5e50e5a33d3a0357272fc1b3',
            user: {
                _id: '5e50e3ec2ec0ef551091c2e9',
                name: 'Ahmad muzakki baru',
                email: 'dzakkiaz7@gmail.com',
                gender: 'male',
                created_at: '2020-02-22T08:18:52.965Z',
                updated_at: '2020-02-22T08:18:53.292Z',
                username: 'dzakki'
            },
            role: 'host',
            statusKey: false,
            statusInvited: 'received',
            __v: 0
            }
        ],
        _id: '5e50e5a33d3a0357272fc1b3',
        name: 'Makan bareng',
        time: 'Sat Feb 22 2020',
        key: 'shoe',
        status: 'onGoing',
        __v: 0
    }

    ```
#### GET EVENTS
* GET
* `/events`
* query = `?status=` `onGoing || done`
* header `authorization=token`
* success
    ```
    [{
        location: { name: 'PIM', lat: 19.311143, lon: -1.40625 },
        members: [
            {
            _id: '5e50e5a33d3a0357272fc1b4',
            event: '5e50e5a33d3a0357272fc1b3',
            user: {
                _id: '5e50e3ec2ec0ef551091c2e9',
                name: 'Ahmad muzakki baru',
                email: 'dzakkiaz7@gmail.com',
                gender: 'male',
                created_at: '2020-02-22T08:18:52.965Z',
                updated_at: '2020-02-22T08:18:53.292Z',
                username: 'dzakki'
            },
            role: 'host',
            statusKey: false,
            statusInvited: 'received',
            __v: 0
            }
        ],
        _id: '5e50e5a33d3a0357272fc1b3',
        name: 'Makan bareng',
        time: 'Sat Feb 22 2020',
        key: 'shoe',
        status: 'onGoing',
        __v: 0
    }]

    ```

#### GET EVENT
* GET
* `/events/:id`
* header `authorization=token`
* success
    ```
    {
        location: { name: 'PIM', lat: 19.311143, lon: -1.40625 },
        members: [
            {
            _id: '5e50e5a33d3a0357272fc1b4',
            event: '5e50e5a33d3a0357272fc1b3',
            user: {
                _id: '5e50e3ec2ec0ef551091c2e9',
                name: 'Ahmad muzakki baru',
                email: 'dzakkiaz7@gmail.com',
                gender: 'male',
                created_at: '2020-02-22T08:18:52.965Z',
                updated_at: '2020-02-22T08:18:53.292Z',
                username: 'dzakki'
            },
            role: 'host',
            statusKey: false,
            statusInvited: 'received',
            __v: 0
            }
        ],
        _id: '5e50e5a33d3a0357272fc1b3',
        name: 'Makan bareng',
        time: 'Sat Feb 22 2020',
        key: 'shoe',
        status: 'onGoing',
        __v: 0
    }

    ```

#### update
* PUT `/events/eventId`
* body `name=string*`, `location=Obj`, `time=String`, `key=String`, `description=string`
* header `authorization=token`
    ```
    example
    {
        name: "Makan bareng kedua",
        location: {
            name: "PIM 2",
            lat: 19.311143,
            lon: -1.406250
        },
        time : new Date().toDateString(),
        key: 'wristwatch',
        description: 'nothing 2',
    }
    ```
* output
    ```
    {
        location: { name: 'PIM 2', lat: 19.311143, lon: -1.40625 },
        members: [
            {
            _id: '5e50e5a33d3a0357272fc1b4',
            event: '5e50e5a33d3a0357272fc1b3',
            user: {
                _id: '5e50e3ec2ec0ef551091c2e9',
                name: 'Ahmad muzakki baru',
                email: 'dzakkiaz7@gmail.com',
                gender: 'male',
                created_at: '2020-02-22T08:18:52.965Z',
                updated_at: '2020-02-22T08:18:53.292Z',
                username: 'dzakki'
            },
            role: 'host',
            statusKey: false,
            statusInvited: 'received',
            __v: 0
            }
        ],
        _id: '5e50e5a33d3a0357272fc1b3',
        name: "Makan bareng kedua",
        time: 'Sat Feb 22 2020',
        key: 'wristwatch',
        description: 'nothing 2',
        status: 'onGoing',
        __v: 0
    }
    ```

#### update status event
* PATCH /events/:eventId/status
* header `authorization=token`
* body `status=enum('onGoing', 'done')`
* output
    ```
    {
        location: { name: 'PIM 2', lat: 19.311143, lon: -1.40625 },
        members: [
            {
            _id: '5e50e5a33d3a0357272fc1b4',
            event: '5e50e5a33d3a0357272fc1b3',
            user: {
                _id: '5e50e3ec2ec0ef551091c2e9',
                name: 'Ahmad muzakki baru',
                email: 'dzakkiaz7@gmail.com',
                gender: 'male',
                created_at: '2020-02-22T08:18:52.965Z',
                updated_at: '2020-02-22T08:18:53.292Z',
                username: 'dzakki'
            },
            role: 'host',
            statusKey: false,
            statusInvited: 'received',
            __v: 0
            }
        ],
        _id: '5e50e5a33d3a0357272fc1b3',
        name: "Makan bareng kedua",
        time: 'Sat Feb 22 2020',
        key: 'wristwatch',
        description: 'nothing 2',
        status: 'done',
        __v: 0
    }
    ```


### Member

#### create

* POST `/events/:eventid/members`
* header `authorization=token`
* body [`userId`, `role=enum('host', 'guest')`]
    ```
    [{
        userId: user,
        role: 'guest',
    }]
    ```
* output
    ```
    {
    location: { name: 'PIM 2', lat: 19.311143, lon: -1.40625 },
    members: [
        {
            _id: '5e50f82e78dc90607f47d2fe',
            event: '5e50f82e78dc90607f47d2fd',
            user: [Object],
            role: 'host',
            statusKey: false,
            statusInvited: 'received',
        __v: 0
        },
        {
            _id: '5e50f82e78dc90607f47d301',
            event: '5e50f82e78dc90607f47d2fd',
            user: [Object],
            role: 'guest',
            statusKey: false,
            statusInvited: 'pending',
        __v: 0
        },
        {
            _id: '5e50f82e78dc90607f47d302',
            event: '5e50f82e78dc90607f47d2fd',
            user: [Object],
            role: 'guest',
            statusKey: false,
            statusInvited: 'pending',
        __v: 0
        }
    ],
    _id: '5e50f82e78dc90607f47d2fd',
    name: 'Makan bareng kedua',
    time: 'Sat Feb 22 2020',
    key: 'wristwatch',
    status: 'onGoing',
    __v: 0
    }

    ```

#### Update status invited

* PATCH `/events/members/status-invited`
* header `authorization=token`
* body `statusInvited=enum('received', 'refused', 'canceled')`
* output
    ```
        {
            location: { name: 'PIM', lat: 19.311143, lon: -1.40625 },
            members: [
                {
                _id: '5e50f98da31baa623e39e1c4',
                event: '5e50f98da31baa623e39e1c3',
                user: [Object],
                role: 'host',
                statusKey: false,
                statusInvited: 'received',
                __v: 0
                }
            ],
            _id: '5e50f98da31baa623e39e1c3',
            name: 'Makan bareng',
            time: 'Sat Feb 22 2020',
            key: 'shoe',
            status: 'onGoing',
            __v: 0
        }
    ```

#### GET Status invited pending
* GET /members/status-invited/pending
* header `authorization=token`
* output
    ```
    [
        {
            _id: '5e50fad2615c2e639ffee7b9',
            event: {
                location: [Object],
                members: [Array],
                _id: '5e50fad2615c2e639ffee7b4',
                name: 'Makan bareng kedua',
                time: 'Sat Feb 22 2020',
                key: 'wristwatch',
                status: 'done',
                __v: 0
            },
            user: '5e50fad2615c2e639ffee7b7',
            role: 'guest',
            statusKey: false,
            statusInvited: 'pending',
            __v: 0
        }
    ]
    ```

#### delete member
* DELETE `/events/:eventId/members/:memberId`
* header `authorization=token`
* output
    ```
        ```
    {
        location: { name: 'PIM 2', lat: 19.311143, lon: -1.40625 },
        members: [
            {
                _id: '5e50f82e78dc90607f47d2fe',
                event: '5e50f82e78dc90607f47d2fd',
                user: [Object],
                role: 'host',
                statusKey: false,
                statusInvited: 'received',
            __v: 0
            },
            {
                _id: '5e50f82e78dc90607f47d301',
                event: '5e50f82e78dc90607f47d2fd',
                user: [Object],
                role: 'guest',
                statusKey: false,
                statusInvited: 'pending',
            __v: 0
            },
        ],
        _id: '5e50f82e78dc90607f47d2fd',
        name: 'Makan bareng kedua',
        time: 'Sat Feb 22 2020',
        key: 'wristwatch',
        status: 'onGoing',
        __v: 0
    }

    ```