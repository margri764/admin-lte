

export interface Alarm {

    idalarm: string,
    alarmDate: string,
    name: string,
    description: string,
    notifFrequency : object,
    iduser? : any,
    status? : string
}


export interface AlarmGrupal {

    idgroupalarm: string,
    alarmDate: string,
    name: string,
    description: string,
    notifFrequency : object,
    excludedUser : any,
    idgroups : object | null
}