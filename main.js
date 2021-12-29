import {area} from './test.js';

let data = {
    todos: [
        {
            id: 0,
            text: 'test'
        },
        {
            id: 1,
            text: 'test2'
        },
    ],
    error: null,
    newTodoText: '',
    visitCount: 0,
    gideCompletedTodos: false,
    message: new Date().toLocaleString(),
    seen: false,
    firstName: 'kimson',
    lastName: 'mustach',
};

let methods = {
    reverseMessage: function(){
        this.message = this.message.split('').reverse().join('');
    },
    reverseFullName: function(){
        let temp = this.firstName.split('').reverse().join('');
        this.firstName = this.lastName.split('').reverse().join('');
        this.lastName = temp;
    }
}

Vue.component('todo-item', {
    props: ['todo'],
    template: '<li>{{todo.text}}</li>'
});

let vm = new Vue({
    el: '#app',
    data: data,
    methods: methods,
    beforeCreate() {
        console.log('this is beforeCreated')
    },
    created: function(){
        console.log('vm created : '+this.message);
    },
    computed: {
        reversedMessage(){
            return this.message.split('').reverse().join('');
        },
        fullName(){
            return this.firstName+' '+this.lastName;
        }
    }
});

Vue.component('calc-head', {
    props: ['result'],
    template: `<thead>
    <tr>
        <th colspan="4">
            <span style="width: 100%; display: inline-block; text-align: left; border: 1px solid black; padding: .5rem;">{{result}}</span>
        </th>
    </tr>
</thead>`
})

Vue.component('calc-body', {
    props: [],
    data: function(){
        return {
            tdStyle: {
                active: true,
                'calc-w': true,
            },
        }
    },
    methods: {
        clickTd(ev){
            const td = ev.target;
            const value = td.textContent;
            if(td.tagName != 'TD') return;
            
            this.$emit('send-to-parent', value);
        }
    },
    template: `<tbody
    :class="[tdStyle]"
    @click="clickTd"
    >
        <tr>
            <td>7</td>
            <td>8</td>
            <td>9</td>
            <td>*</td>
        </tr>
        <tr>
            <td>4</td>
            <td>5</td>
            <td>6</td>
            <td>/</td>
        </tr>
        <tr>
            <td>1</td>
            <td>2</td>
            <td>3</td>
            <td>+</td>
        </tr>
        <tr>
            <td>=</td>
            <td>0</td>
            <td>.</td>
            <td>-</td>
        </tr>
    </tbody>`
})

Vue.component('calculator', {
    props: ['result', 'parentMethod'],
    template: `<table>
        <calc-head
        :result="result"
        ></calc-head>

        <calc-body
        @send-to-parent="parentMethod"
        ></calc-body>
    </table>`,
});

let calc = new Vue({
    el: '#calculator',
    data: {
        title: 'calculator',
        result: 0,
        input: 0,
        calcStyle: {
            centered: true
        },
        // tdStyle: {
        //     active: true,
        //     'calc-w': true,
        // }
    },
    created(){
        window.addEventListener('keydown', this.keydownTd);
    },
    beforeDestroy() {
        window.removeEventListener('keydown', this.keydownTd);
    },
    methods: {
        // clearZero: function(){
        //     this.input = this.input==0?'':this.input;
        // },
        // setZero: function(){
        //     this.input = this.input==''?0:this.input;
        // },
        validateRs(value){
            const ableKeys = [
                'enter',
                'backspace',
                'delete',
                '\\=\\-\\*\\+\\.\\/',
                '0-9',
            ];
            const valid = ableKeys.filter(x=>value.match(new RegExp(value.match(/[A-z]/gm)?x:`[${x}]`, 'gim')));

            if(valid.length==0) return;

            if(this.result==0){
                this.result = '';
            }
            
            if(value.match(/[\d\.\(\)\-\=\+\*\/]|enter|backspace|delete/gim)) {
                if(value=='.'){
                    const flag = this.result.toString().match(/[\-\+\/\*]/);
                    if(flag){
                        const findIdx = this.result.split(flag);
                        const idx = findIdx[findIdx.length-1];
                        if(idx.match(/\./gm)){
                            // null
                        } else {
                            this.result += value;
                        }
                    } else {
                        if(!this.result.toString().match(/\./gm)){
                            this.result += value;
                        }
                    }
                } else {
                    if(value.match(/delete/gim)){
                        this.result = 0;
                    } else {
                        value=='Backspace'?this.result = this.result.slice(0,this.result.length-1):
                        value!='='&&value!='Enter'
                        ?this.result += value
                        :this.result = new Function(`return ${this.result}`)();
                    }
                }
            }
        },
        parentMethod(value){
            this.validateRs(value);
        },
        keydownTd: function(ev){
            const value = ev.key;
            
            this.validateRs(value);
        },
        // clickTd: function(ev){
        //     const td = ev.target;
        //     const value = td.textContent;
        //     if(td.tagName != 'TD') return;

        //     if(this.result==0){
        //         this.result = '';
        //     }

        //     value!='='
        //     ?this.result += value
        //     :this.result = new Function(`return ${this.result}`)();
        // }
    },
    // watch: {
    //     input: function(valid, before){
    //         this.input = valid.toString().match(/[^\d]/gm)?before:valid;
    //     }
    // },
    computed: {
        uppercasedTitle(){
            return this.title.toUpperCase().bold();
        }
    }
})