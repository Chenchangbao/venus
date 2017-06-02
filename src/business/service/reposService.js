export default app=>{
    app.service('ReposService',['HttpService',HttpService=>{
        return{
            'getGitReposByPage': params=>HttpService.post('repos/showrepos/',params),
            'getGitReposDetailByReposId': params=>HttpService.get('repos/showReposDetail/'+params),
            'createRepos': params=>HttpService.post('repos/createRepos/',params),
            'updateRepos': params=>HttpService.post('repos/updateRepos/',params),
            'isReposNameRepeat': params=>HttpService.get('repos/isReposNameRepeat/'+params),
            'getAllSystem':() =>HttpService.get("repos/getAllSystem"),
            'getRoles':() =>HttpService.get("repos/getRoles"),
            'repeatExeGerritInit':params=>HttpService.post("repos/repeatExeGerritInit",params)
        }
        }])
};