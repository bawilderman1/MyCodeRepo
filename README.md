# MyCodeRepo

## Git Reference

* Create a new local repository
	`git init`
	
* Checkout a repo from server \(first time\)
	`git clone /path/to/repository`						\(local server\)
	`git clone username\@host\:/path/to/repository`		\(remote server\)
	
* Pull subsequent repo changes down from the server
	`git pull origin \<branch\_name\>`
	
* Save changes locally
	`git add \-A`
	`git commit \-m \"Note about commit\"`
	
* Push changes up to server
	`git push origin \<branch\_name\>`
	`git push origin \-\-all`
	
* Create branch on server
	`git push \-u origin \<branch\>`
	or 
	`git push origin \<local\_branch\>\:\<remote\_branch\>`
	
* Create a branch locally from an existing branch
	`git checkout \-b \<my\_feature\> develop`
	
* Set upstream branch on server
	`git branch \-\-set\-upstream\-to\=origin/\<branch\> \<branch\>`
	
* Delete branch on server
	`git push origin \-\-delete \<remote\_branch\>`
	or
	`git push origin \:\<remote\_branch\>`
	
* Push tags up to Server
	`git push origin \-\-tags`
	
* Delete a tag
	`git tag \-d 2\.2\.0`

* Add a tag
	`git tag \-a 2\.2\.0 \-m \"\<tag message\>\"`

* Add an origin repo
	`git remote add origin \<server\>`
	
* Merge a feature branch back into master
	`git checkout master`
	`git merge feature/\<branch\>`
		* If there are any merge conflicts
			`git add \<corrected\_file\>`
			`git merge \-\-continue`
		* until no more conflicts exist
	`git push origin master`
	
* Merge a feature branch back into master and squash feature commits
	`git checkout master`
	`git merge \-\-squash feature/\<branch\>`
	`git commit`
	
* Merge a feature branch with a new commit message
	`git checkout master`
	`git merge \-\-no\-ff feature/\<branch\> \-m \"Merge feature into master\"`
	`git push origin master`
	
* Rename a branch
	`git branch \-m feature/\<new\_branch\_name\>`
	`git push origin \:feature/\<old\_branch\_name\> feature/\<new\_branch\_name\>`
	`git push origin \-u feature/\<new\_branch\_name\>`
	
* Move back to a previous commit
	`git reset \-\-hard \[commit\_hash\]`
	`git push origin master \-\-force`
	
* Clone remote repo and then pull down the develop branch
	`git clone \"\[repo\_url\]\"`
	`cd \[into\_destination\_folder\]`
	`git checkout \-b develop origin/develop`
	
	