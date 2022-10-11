# -*- mode: ruby -*-
# vi: set ft=ruby :

# One time only on first vagrant up
# Set node_modules SymLink
# vagrant up (on windows start terminal as admin)
# ln -sf ~/node_modules/ /var/www/html/application

Vagrant.configure("2") do |config|

    config.vm.box = "developer"
    config.vm.hostname = "zencoding"

    # Set VM Hardware
    config.vm.provider "virtualbox" do |v|
        v.memory = 4096
        v.cpus = 4
    end

    # Check if required plugins are installed
    required_plugins = %w( vagrant-fsnotify )
    required_plugins.each do |plugin|
      system "vagrant plugin install #{plugin}" unless Vagrant.has_plugin? plugin
      system "echo ON VAGRANT"
    end

    # config local IP
    config.vm.network "private_network", ip: "192.168.20.20"

    # Allow Browser Sync on webpackDevServer
    config.vm.network :forwarded_port, guest: 3000, host: 3000, auto_correct: true
    #config.vm.network :forwarded_port, guest: 3031, host: 3001, auto_correct: true

    # enable/disable notify plugin
    $notify = false
    if $notify
        config.vm.synced_folder ".", "/var/www/html/application",
            :mount_options => ["dmode=777", "fmode=777"],
            SharedFoldersEnableSymlinksCreate: true,
            fsnotify: true, exclude: [".idea", ".git","vendor"]
        # run plugin
        config.trigger.after :up do |t|
        t.warn = "Starting fs-notify"
           t.name = "vagrant-fsnotify"
        t.run = { inline: "vagrant fsnotify" }
        end
    else
        config.vm.synced_folder ".", "/var/www/html/application",
            :mount_options => ["dmode=777", "fmode=777"],
            SharedFoldersEnableSymlinksCreate: true
    end

    config.vm.provider "virtualbox" do |v|
        v.customize ["setextradata", :id, "VBoxInternal2/SharedFoldersEnableSymlinksCreate/application", "1"]
    end

end
