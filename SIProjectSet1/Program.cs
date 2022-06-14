using Serilog;


namespace SIProjectSet1
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var configuration = new ConfigurationBuilder()
           .SetBasePath(Directory.GetCurrentDirectory())
           .AddJsonFile("appsettings.json")
           .Build();

            Log.Logger = new LoggerConfiguration()
               .MinimumLevel.Warning()
               .WriteTo.MSSqlServer(
                   connectionString: configuration.GetSection("Serilog:ConnectionStrings:LogDatabase").Value,
                   tableName: configuration.GetSection("Serilog:TableName").Value,
                   appConfiguration: configuration,
                   autoCreateSqlTable: true,
                   columnOptionsSection: configuration.GetSection("Serilog:ColumnOptions"),
                   schemaName: configuration.GetSection("Serilog:SchemaName").Value)
               .CreateLogger();
            CreateHostBuilder(args).Build().Run();
        }

        public static IHostBuilder CreateHostBuilder(string[] args) => Host
            .CreateDefaultBuilder(args)
            .ConfigureWebHostDefaults(webBuilder =>
            {
                webBuilder.UseStartup<Startup>();
                webBuilder.UseKestrel(opts =>
                {
                    opts.ListenAnyIP(5000);
                    //opts.ListenAnyIP(5001, opts => opts.UseHttps());
                });
            }).UseSerilog();




    }
}