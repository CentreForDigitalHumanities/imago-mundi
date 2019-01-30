import Fsm from '../core/fsm';

const DirectionFsm = Fsm.extend({
    initialState: 'travelling',
    states: {
        travelling: {
            arrive: 'arriving',
            leave: 'leaving',
            testrobert_fsm_arrive: 'testrobert',
        },
        arriving: {
            leave: 'leaving',
            testrobert_fsm_arrive: 'testrobert',
        },
        leaving: {
            arrive: 'arriving',
            testrobert_fsm_arrive: 'testrobert',
        },

        testrobert: {
            leave: 'leaving',
        },


    },
});

export default DirectionFsm;
