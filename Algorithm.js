var duration = 90
var slot_duration = 15
var gap = 30;
var jump = parseInt(duration/15);

// to generate slots of slot_duration from the given duration 
// fhr - from hour ; fmin - from min
function generateSolts(fhr,fmin){
    let slots = []    
    let start_min = fmin, start_hr = fhr
    for (let i = 0; i < jump; i++) {
        let flag = false;
        let end_min = start_min+slot_duration, end_hr = start_hr;
        
        if(end_min >=60) {end_min=end_min-60; flag=true};
        if(flag) end_hr++;

        let obj =  {
            "FromHour": start_hr,
            "FromMinutes": start_min+1,
            "ToHour": end_hr,
            "ToMinutes": end_min
        }
        slots.push(obj);

        start_hr = end_hr;
        start_min = end_min;        
    }
    // console.log('slots created', slots);
    return slots;
}

// to check whether a duration is allowed if yes then where it should be inserted 
function judge(currentSlots, range){
    console.log(range)
    let postFlag=-1;
    for( let i=0; i<currentSlots.length; i+=jump){
        const curr_start = currentSlots[i];
        const curr_end = currentSlots[i+jump-1]
        
        const pre = (curr_start.FromMinutes-1===0 ? 
                        (curr_start.FromHour-1)*60 + 60 : 
                        curr_start.FromHour*60 + curr_start.FromMinutes-1) 
                    - (range[3]===0 ? 
                        (range[2]-1)*60 + 60 : 
                        range[2]*60 + range[3])
             
        const post = (range[1]===0 ? 
                        (range[0]-1)*60 + 60 
                        : range[0]*60 + range[1]) 
                    - 
                    (curr_end.ToMinutes===0 ? 
                        (curr_end.ToHour-1)*60 + 60 
                        : curr_end.ToHour*60 + curr_end.FromMinutes)
        // console.log(curr_start,pre,post)

        // 12:30 - 2:30 (curr)  09:15-11:15 (new slot) --example
        // inserting previous to current range
        if( pre >= gap ){
            if(postFlag===1 || i===0)
                return {"isAllowed":true, insertion_index:i};
        }
        // 12:30 - 2:30 (curr)  09:15-11:15 (new slot) --example
        // inserting after current range
        post >= gap ? postFlag = 1 : postFlag = -1;
        
    }                           // -1 -> push at the end
    return postFlag === 1 ?  {"isAllowed":true, insertion_index: -1} :  {"isAllowed":false};

}
// considering for monday ( for demo )
let days = {'mon':[]}

days.mon.push(...generateSolts(5,0,6,30));
days.mon.push(...generateSolts(11,15,12,45));
days.mon.push(...generateSolts(18,17,19,47));
//  5-7  11-13 18-20 
console.log('existing slots', days)

const tests = [[3,0,4,30],
                [1,0,2,30],
                [12,0,13,30],
                [7,0,8,30],
                [4,30,6,0],
                [14,12,15,42],
                [15,43,17,13]
                
            ];
tests.map((test)=>{
    let result = judge(days.mon, test);
    if(result.isAllowed){
        result.insertion_index===-1 ?
            days.mon.push(...generateSolts(...test.slice(0,2)))
            :
            days.mon = [...days.mon.slice(0,result.insertion_index),
                        ...generateSolts(...test.slice(0,2)),
                        ...days.mon.slice(result.insertion_index)]
    }
    console.log(result,days.mon.length/jump);
})
console.log('updated_slots_after_tests',days.mon)
