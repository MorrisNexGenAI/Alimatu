i'm glad i made up to in this week of coding.
this is more than a huge miles stone for me.
To admit it has been harder for me to dive in but i'm glad i'm finally learning to love the process.

Today saturday, i will focus on the process of explanining my apis and hooks in common way possible so that i can remind myself and also serve as guardline to understanding it better.

This week i tackle these files:
Apis/
students, academicYear, periods, subjects, and levels.
hooks/
useStudents, useSubjects, useAcademicYear, usePeriods, and useLevels.

So, my today explanation will focus on these files.
starting with the first file which is the apis files i will begin with the:
apiClient, in it i have all my apis because i want to simplify apis path to make it easier to be use.

1. firstly you asked your self what are you going to do.
the answer is you are going to set up apis files inorder to communicate with your backend.
2. You asked your self what kinds of datas are coming from the backend, is it direct CRUD?
is it paginated? Array? or object?
how are you going to accept it depends on your answers, as for me my datas are paginated so i will receive it in a paginated form.
3. Next what are the datas you are receiving and their reqirement to perform CRUD?
these will determine the types to setup for typescript in index.
ex.. IF i'm receiving students then it means i need to know what are the neccessary needed to perform full CRUD on students.
what are students made up of: ex.. name, date of birth, gender etc...

4. Are the datas tie to another key data too?
ex... students reqire level and level is another key django app that is require to add student or create new student.
so, in this case you need to fetch level before doing certain thing or carrying on certain task on students, like adding students.

5. Are the datas string or number?
You need to know how the data is coming from the backend. is it string or number.
Some are both string and number, that is it accept string and number, so which one are you using?
the string or the id, what ever will determine your next action.

6. what are other reqirement to perform full CRUD or other actions on the datas that are coming?
this question bring about authentication, CSRF token, etc....
Some data  like students require authentication with specific token before you access or create it, while some like creating levels require CSRF token before creating or updating or deleting.

6. After answering key questions then you move here to seperating your datas.
This is where you decide how you are going to arrange your codes within the app so that it is dry and reusable.

you might set up a useApi(): To handle the Authentication and authorization of accessToken inorder to access the base url or the backend with out manually setting it on every api in the app like levels or students each time you need them.
also you can fully  define the actions of get, put, delete, and post so that you can just use it accross the apps.
You can setup the refresh token so that it is refresh every time and you don't have to suffer on refreshing or when the refresh token expires.

You can setup a single api like apiClient so that it can serve all other hooks without having too many imports.

Next you can define your specific types in types/index.ts so that it can be accessble to any hook or maybe for forms and pages later, but what ever you are maiking sure it is reusable.

The next phase is diving into my actual apis after expaniing above.

The apiClient is my central hub.
This is where i have all my apis so that it can be easilly access.

firstly I imported my useApi which already define my CRUD.
next i import my types from types.

next i create a helper function to handle paginated or array response so that i can use it through out my codes without manually do it all time.

and then my apiClient start:{
i have gradesheets:{
i have the getGradeSheetsByLevel function which takes the params levelID: number and academicYear:string;
i define my variable get which i took from the useApi as const {get}= useApi();
i define the response which is to await the apis gradesheet from the backend and take the results by level with the reqire params level_id:levelId and academic_Year:academicYear.
this will be use to display the gradesheets from the backend which will contain students grades and can be use in the fronend so the teachers can see what's going on.
i return it as extractData using the extract paginated function above so that it can be extracted based on whatever types it comes in.
next is the catch block where i catch errors and sealed the closing of this function.
}
 
 next is the academicYeaars: {
    i set up the function to get the academicYears.
    ths doensn't take any args in it async because it doesn't need to.
    next i the variable get is assigned to useApi();
    next the try block starts.
    i set the response to await the response from the backend academic_years apis.
    log the response
    and then return the extractData.
    next i catch error.

the next is createAcademicYear.
this take an args which is data:{name:string}. it takes it because academicYear in the backend have the name filed which are use to refere to academicYear.
i assign the post to use api.
i set up the try block
i assign the response to await the post of academicYear params which is the name, a field in the backend django to the backend apis academic_years. This time a new thing is introduce which is a header token.
headers: { 'X-CSRFToken': document.cookie.match(/csrftoken=([^;]+)/)?.[1] || '' },
it is use doing post, update(put), or delete.
it is there to make sure no data is send to the backend mistakenly.
log the response
and then return response.data
next catch error.

the next is updateAcademicYear
this take an args which is id with a number type, and then the data.
asign the put to useApi
the try is setup
next await the respsonse to put the id and data to the backend academic_years api, along with the header token.
log the response
return the response
catch error

the next is deleteAcademicYear:
this take an args of id only.
asign the del to useApi
the try is setup
next is await the respone to delete the id request send to teh backend academic_years along with the header token
log the response
return the response
catch error.

 }
next we start the students:{
    we have the getstudentsBylevel which takes two args that are requred to get a students.
    they are levelId with a number type, and academicYear with a string type.
    next we asign the method we will be using to the useApi, in this case it is get.
    the try is setup
    next is await the response to get the students from the backend students api, but witht he params of level_id set to levelId and academic_year set to academicYear.
    next log the response
    return the extractData
    catch error


the next is addStudentAndEnroll: this is both adding and enrolling students so it firstly takes the args data which is the studentEnrollmentData. this is already setup in the type index.ts.
assign the method in this case post to useApi()
start the try
await the studentResponse to post to the backend studens with the students data.
create a new variable of newStudent and asign it to the studentResponse data
log the response

define a new variable of enrollmentResponse to await the post to the enrollment backend api with the enrollment datas needed.
log the enrollment
return newStudent
catch error.

next is update student: this take the args of id, and data which are the reqire data to update a student.
assign the the requre method, put in this case to the useApi();
start the try 
await the response to put the new updated id, and data to the students backend
log the response
return the response data
catch error

next is to delete the student: this take the args of id only.
asign the method
set the try
await the api to del the student using the id
log the response
catch error

}

the next is the Period;{
    
firstly is getPeriods which take zero args.
asign the method
set the try
await the response to get the periods from the periods backend
log the response
return the extracted data with extractData
catch error


next is createPeriod: it takes the args of data which is period a string.
this is the field in the backend django period app which represent the period.
asign the method
set the try
await the response to post a new period along with the data and header token
log the response
return the response.data
catch error

next is updatePeriods: this take two args of id, and data.
the reason is because you are editing a specific period(id) and you are eding the data(period).
asign the method
set the try
await the response to put a new period along with the id, and data and header token.
log the response
return the data
catch error


next is deletePeriods: this take a single args which is id.
asign the method
set the try
await the response to del the period request send to the backend periods along with the id and csrf header token.
log the response
catch error
}
next is the subject:{
    firstly you get a subject by level by setting up the require logic
    getSubjectsByLevel.
this will take an args of levelId, the reason is you need the level id to get that particular subejct for a specific class.
Assigned the method
set the try
await the response to fetch the subject from the subject backend with the params of level_id: set to levelId.
log the response
return the response in an extracted format by using extractData
catch error.

next is createSubject: this take the data with two required field, subject and level, because you need both to create subject.
asign the method
set the try block to handle error
await the response to post new subject to the subject api with the data and token.
log the response
return the response data
catch error

next is the updateSubject. this too take the same two args for data which are subject and level, but with a new require one call the id.
so it is id, and data.
asign the method
set up the try
await the response to put the updated data to the subject apis with the id and data, and also CSRF header token
log the response
return the response
catch error

next is delete subject: this take a single args which is id.
asign the method
setup the try
await the response to delete the subject request sent to the backend subject apis with id along with the header token.
log the response
catch error
}

next is the level:{
    we have the getLevels which takes no args.
    asing the method
    setup the try
    await the response to fetch level from the level backend
    log the response
    return the response in an extracted format by using the extractData
    catch error


next is the creteLevels: this take a single args called the data which is the name, a filed in the level backend.
asign the method
setup the try
await the response to post a new level to the backend level with the data along with the header token.
log the response
return the response.data
catch error


next is the updateLevel: this take two args of id and data.
the data is the same as the name which we saw above.
asign the method
setup the try
await the response to put a new level to the backend level api with the id and data along with the header token
log the response
return the response
catch error


next is the deleteLevel: this take a single args of id.
asign the method
setup the try
await the response to del the level from the backend level with the id along with the header token
log the response
catch error
}
}

My apis is actually larger but these are the files i focused on for this week, and most importantly most of the files just maintain this pattern with minimal changes.
so, understanding this is like a root for the tree.

Next we will dive into the hooks.

the first file is the useSubjects.
firstly we import all the files we will be using.

we define our hook: in this case the useSubject.
we define the useStates we will be using

start the useEffect
The next thing is about either fetching directlly what we need within the hooks or if there is an initial data we will need before the main data, then we can fetch it.
In this case we need an inital data: level, so we will fetch it firstly.
we define the fetchLevelData function which doensn't take no args.
set loading to true
start the try
awit the levelresults from the levels api which is apiClient.levels.getLevels();
catch error
toast error
setLevels to empty if it failed
finally end the loading by setting setLoading to false
call the fetchLevelData function()
set the empty [] at the end.

next is the second useEffect.
this is about the main data.
firstly you set a logic to make sure a level id is selected
define the fetchSubjects function which takes no args.
set the loading to true
start the try
await subjectResponse from the apiClient which uses the getSubjectsByLevel(selectedlevelId)
catch error
toast
setSubjects to empty([])
finally off the loading
call the function fetchSubject()
return the empty array:
},[]) (please explain why this is returned)

next is the function to handleLevelChange, making sure the levelId is parse as interger and not string
set the level to the levelId
log the response

return everything to be use out in forms, pages, etc...

i didn't complete the full crud for subjects, not that i don't know but it is not neccessary right now.

next is period:

firstly we import all the files we will be using.

we define our hook: in this case the usePeriod.
we define the useStates we will be using: periods, loading, error.
no need for initial datas so we defne the fetchPeriods functions.
setLoading to true
start the try
asign data to the awaited response from the apiClient to getLevels
setPeriods to the data
set error to null
catch error
finally set loading to false

call useEffect and then place the fetchPeriods() within it and then returned the same empty bracket:
},[]);


next is the function to addPeriod: this take the args data: which is the period.
setLoading to true
start the try
asigned the newPeriod to the awaited data from the apiClient
setPeriods to the newPeriod like this([...periods, newPeriods])(I don't know how this is called).
toast success
setError to null.
catch error
finally setLoading false.

next is the function to update periods: this take two args, the id, and data which is period.
setLoading true
start the try
asigned the updated period to the awaited data from the apiClient
set a new variable call periodMap and map the updated data.
setPeriods to the periodMap.
toast success
setError null
catch error
finally set the loading to false.

next is the function to delete periods: this take a single args cid.
setLoading true
start the try
asigned the deletePeriod to the awaited data from the apiClient
set a new variable call filteredPeriod to filter the response
setPeriods to the filteredPeriod
toast success
setError to null 
catch error
finally setLoading false.


return everything to be use outside.

Next is the level:

firstly we import all the files we will be using.

we define our hook: in this case the useLevel.
we define the useStates we will be using: levels, loading, error.
no need for initial datas so we defne the fetchLevels functions.
setLoading to true
start the try
asigned data to the awaited apiClient response to getLevels
setLevels to data
setErrors to null
catch errors
finally setLoading false

use useEffect to call the fetchLevels() within it
call the fetch levels.

next is addLevel: this take a single args call data: which is the name;
setLoading to true
start the try
asigned newLevel to await the apiClient response to add the data.
set the levels to the new level like this ([...levels, newLevel])(please tell me what this mean).
toast success
set Error to null
catch error
finally set loading to false

next is editLevel. this take two args: the id and data which is the name.
set loading to true
starrt the try
asigned updatedLevel to await the apiClient to put or update the new params
map the levels like this: (levels.map((l)=> l.id === id ? updatedLevel : l))(explan this too)
set the level to the mapLevel.
toast a success
setErrorl to null
catch error
finally setLoading to false

next is deleteLevel: this take a single args call id.
set the loading to true
start the try
 await the apiClient to delete the level
filtered the deleted level; (level.filter((l)=> llid == id))(explain this too)
toast a success
setError to null
catch error
finally set loading to false

return everything.

next is the useAcademicYears.

firstly we import all the files we will be using.

we define our hook: in this case the useAcademicYears.
we define the useStates we will be using: academicYears, loading, error.
no need for initial datas so we defne the fetchAcademicYears functions.
setLoading to true
start the try
asinged the data to await the apiclient to getAcademicYears()
setAcademicYears to the data
set error to null
catch error
finally setLoading to false

next is addAcademicYear: this take a single args call the data: which have the name, start_date, and end_date.
setLoading to true
start the try
assigned the newAcademicYear to await the apiClient to add the academicYear
set the academic year to the new one
set Error to null
catch error
finally setLoading to false

next is editAcademicYear; this take two args: Id, and data.
setLoading to true
start the try
assigned the updatedAcademicYear to await the apiClient to put or update the academicYear
map the updatedAcademicYear 
set the academicYear to the map academicYear
toast success
set Errorl to null
catch error
finally setLoading to false

next is deleteAcademicYear: this take a single args: id.
set the loading to true
start the try
await apiclient to delete the academicYear
filtered the academicYear
set the acadmicYear to the filteredAcademicYear
toast success
setError to null
catch error
finally set loading to false

return everything.


next is the students.

firstly we import all the files we will be using.

we define our hook: in this case the useStudents.
we define the useStates we will be using: students, levels, academicYears, selectedLevelId, selectedAcademicYearId, loading.
students is a bit complex because we need two initial data which are: level and academicYear inorder to fetch students.

we will firstly fetch the inital datas.
start the useEffect
define the fetchInitial data which takes no args.
setLoading to true
start the try
define the levelResponse and academicYearResponse to await promise.all: means getting both at the same time from apiClient
set the level to the level Response
set the academicYear to the academicYear response

define the currentYear by setting it to academicYear response plus a default current year 2024/2025: academicYearResponse.find((year)=>year.name === '2024/2025)
setSelectedAcademicYear to current year.
catch error
toast error
set both level and academicYear to empty ([]) just incase: 
finally setLoading to false.

call the fetchinitialData()
end everything with []


the second useEffect will kick start the students.
firstly you make sure that unless level and acadmemicYear id are selected, students should be set to ([])
return;
define the fetch students functions which takes no args.
set loading to true
start the try
asigned  or map academicYear to the selectedAcademicYearId
make sure academicYear is selected.
await the student response from the apiClient to fetch students by both acadmicYear and level
filtered the students by firstName and lastName:const filteredStudents = studentsResponse.filter(
          (student: Student) => !(student.firstName === 'Test' && student.lastName === 'Student')
        );

setStudents to the filtered students.
log the response
catch error
toast error
setStudents([])
finally set loading to false
call the fetchstudents();
end it with: 
  }, [selectedLevelId, selectedAcademicYearId, academicYears]);

next is the function to addStudentAndEnroll: it takes a args: data:which are the students infomation needed to be added.
make sure level and acadmicYear ids are selected before adding
toast error just incase
return;
set loading to true
start the try
asigned the studentData to the type studentEnrollmentData.
asigned new Student to await the apiClient to add and enroll student.
if academicYear is selected, asigned the updatedStudents to await the getStudents inorder to access the just added students.
filtere students
set Students to the filter students
toast.success
catch error
toast.error
finally set loading to false.

the delete and edit students are in my useStudentManagement and i didn't reach there.

next you handle the level change
next you handle the academicYear change
this is because you want to make sure it is passing intergers and not strings.

return everything.

so, that was what i did for last week. i wasn't able to complete my explanation yesterday, but i'm glad i did today.
To be real: what is the difference between args and params?




