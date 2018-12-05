import React from 'react'
import { inject, observer} from 'mobx-react';
import {observe} from 'mobx';


let ProfileBox = inject("recordStore", "userStore")(  observer(class ProfileBox extends React.Component {

    constructor(props) {
        super(props);
    }

    // async loadRecordAfterUser() {
    //     await when(() => this.props.userStore.values.currentUser._id);
    //     try{
    //         console.log(JSON.stringify(this.props.userStore.currentUser.orgsAndRecords[0]));
    //         this.props.recordStore.setOrgId(this.props.userStore.values.currentUser.orgsAndRecords[0].organisation);
    //         this.props.recordStore.setRecordId(this.props.userStore.values.currentUser.orgsAndRecords[0].record);
    //         this.props.recordStore.getRecord();
    //     }catch(error){
    //         console.log('user has no orgsAndRecords');
    //     }
    // }
    getRecord() {
        this.props.recordStore.setOrgId(this.props.userStore.values.currentUser.orgsAndRecords[0].organisation);
        this.props.recordStore.setRecordId(this.props.userStore.values.currentUser.orgsAndRecords[0].record);
        this.props.recordStore.getRecord();
    }

    componentDidMount() {
        if(this.props.userStore.values.currentUser._id){
            this.getRecord();
        }else{
            observe(this.props.userStore.values, 'currentUser', (change) => {
                this.getRecord();
            });
        }  
    };

    render(){
        const { values, errors, inProgress} = this.props.recordStore;
        if(values.record.name){
            return(
                <div>
                    This is the profile of
                    <div>
                        {values.record.name}
                    </div>
                </div>
            );
        }else{
            return(
                <div>
                    You haven't any profile yet. Join or create a Wingzy !
                </div>
            )
        }
        
    }
}));

export default (ProfileBox);