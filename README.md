# MyCodeRepo

## Git Reference

* Create a new local repository
	`git init`
	
* Checkout a repo from server \(first time\) <br/>
	`git clone /path/to/repository`						\(local server\) <br/>
	`git clone username@host:/path/to/repository`		\(remote server\)
	
* Pull subsequent repo changes down from the server <br/>
	`git pull origin \<branch\_name\>`
	
* Save changes locally <br/>
	`git add -A` <br/>
	`git commit -m "Note about commit"`
	
* Push changes up to server <br/>
	`git push origin <branch_name>` <br/>
	`git push origin --all`
	
* Create branch on server <br/>
	`git push -u origin <branch>` <br/>
	or <br/>
	`git push origin <local_branch>:<remote_branch>`
	
* Create a branch locally from an existing branch <br/>
	`git checkout -b <my_feature> develop`
	
* Set upstream branch on server <br/>
	`git branch --set-upstream-to=origin/<branch> <branch>`
	
* Delete branch on server <br/>
	`git push origin --delete <remote_branch>` <br/>
	or <br/>
	`git push origin :<remote_branch>`
	
* Push tags up to Server <br/>
	`git push origin --tags` 
	
* Delete a tag <br/>
	`git tag -d 2.2.0`

* Add a tag <br/>
	`git tag -a 2.2.0 -m "<tag message>"`

* Add an origin repo <br/>
	`git remote add origin <server>`
	
* Merge a feature branch back into master <br/>
	`git checkout master` <br/>
	`git merge feature/<branch>` <br/>
		* If there are any merge conflicts <br/>
			`git add <corrected_file>` <br/>
			`git merge --continue` <br/>
		* until no more conflicts exist <br/>
	`git push origin master`
	
* Merge a feature branch back into master and squash feature commits <br/>
	`git checkout master` <br/>
	`git merge --squash feature/<branch>` <br/>
	`git commit`
	
* Merge a feature branch with a new commit message <br/>
	`git checkout master` <br/>
	`git merge --no-ff feature/<branch> -m "Merge feature into master"` <br/>
	`git push origin master`
	
* Rename a branch <br/>
	`git branch -m feature/<new_branch_name>` <br/>
	`git push origin :feature/<old_branch_name> feature/<new_branch_name>` <br/>
	`git push origin -u feature/<new_branch_name>`
	
* Move back to a previous commit <br/>
	`git reset --hard [commit_hash]` <br/>
	`git push origin master --force`
	
* Clone remote repo and then pull down the develop branch <br/>
	`git clone "[repo_url]"` <br/>
	`cd [into_destination_folder]` <br/>
	`git checkout -b develop origin/develop`
	
	